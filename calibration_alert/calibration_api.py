from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import sys
from werkzeug.utils import secure_filename
import pandas as pd
from datetime import datetime
import json

# Add the Alert System path to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'Calibration Alert System', 'Alert_System_Automation', 'src'))

try:
    from excel_reader import ExcelReader
    from alert_manager import AlertManager
    from email_sender import EmailSender
    ALERT_SYSTEM_AVAILABLE = True
    print("✅ Alert System modules loaded successfully")
except ImportError as e:
    print(f"⚠️ Warning: Alert system modules not available: {e}")
    ALERT_SYSTEM_AVAILABLE = False

app = Flask(__name__)
# Configure CORS explicitly
CORS(app, origins=["*"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
     supports_credentials=True)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'xls', 'xlsx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Global variables for equipment data
current_equipment_data = []
last_uploaded_file = None
alert_manager = AlertManager(30) if ALERT_SYSTEM_AVAILABLE else None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def format_date_for_json(date_obj):
    """Convert datetime objects to ISO format strings for JSON serialization"""
    if isinstance(date_obj, datetime):
        return date_obj.isoformat()
    return date_obj

def process_equipment_data(data):
    """Process equipment data and ensure dates are properly formatted"""
    import pandas as pd
    processed_data = []
    for item in data:
        processed_item = item.copy()
        # Convert datetime objects to strings for JSON serialization
        if 'Next Due Date' in processed_item:
            processed_item['Next Due Date'] = format_date_for_json(processed_item['Next Due Date'])
        
        # Handle NaN values - convert to empty strings
        for key, value in processed_item.items():
            if pd.isna(value) or str(value).lower() == 'nan':
                processed_item[key] = ''
            elif isinstance(value, float) and str(value) == 'nan':
                processed_item[key] = ''
        
        processed_data.append(processed_item)
    return processed_data

# Global OPTIONS handler for CORS preflight requests
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

@app.route('/api/health', methods=['GET', 'OPTIONS'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'alert_system_available': ALERT_SYSTEM_AVAILABLE,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/equipment', methods=['GET'])
def get_equipment():
    """Get current equipment data"""
    global current_equipment_data
    
    if not current_equipment_data:
        return jsonify({
            'equipment': [],
            'message': 'No equipment data available. Please upload an Excel file.',
            'last_updated': None
        })
    
    return jsonify({
        'equipment': process_equipment_data(current_equipment_data),
        'count': len(current_equipment_data),
        'last_updated': datetime.now().isoformat()
    })

@app.route('/api/equipment', methods=['POST'])
def add_equipment():
    """Add new equipment manually"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['Type-Description', 'Serial no.', 'Manufacturer', 'Location', 'InternalNo', 'Next Due Date']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Parse the date
        try:
            due_date = datetime.strptime(data['Next Due Date'], '%Y-%m-%d')
            data['Next Due Date'] = due_date
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Add to current equipment data
        global current_equipment_data
        current_equipment_data.append(data)
        
        return jsonify({
            'message': 'Equipment added successfully',
            'equipment': process_equipment_data([data])[0]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle Excel file uploads"""
    global current_equipment_data, last_uploaded_file
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '' or file.filename is None:
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Only .xls and .xlsx files are allowed'}), 400
    
    try:
        filename = secure_filename(file.filename or 'uploaded_file.xlsx')
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Use the existing alert system to process the file
        if ALERT_SYSTEM_AVAILABLE:
            excel_reader = ExcelReader(filepath)
            equipment_data = excel_reader.extract_relevant_columns()
            
            if equipment_data:
                # Process dates properly
                for item in equipment_data:
                    if 'Next Due Date' in item:
                        parsed_date = excel_reader.parse_date(item['Next Due Date'])
                        item['Next Due Date'] = parsed_date
                
                current_equipment_data = equipment_data
                last_uploaded_file = filename
                
                return jsonify({
                    'message': f'File {filename} uploaded and processed successfully',
                    'equipment_count': len(equipment_data),
                    'filename': filename
                })
            else:
                return jsonify({'error': 'No valid equipment data found in the file'}), 400
        else:
            # Fallback processing without alert system
            try:
                df = pd.read_excel(filepath, header=1)
                equipment_data = []
                
                for _, row in df.iterrows():
                    if pd.notna(row.get('Type-Description')):
                        equipment_data.append({
                            'Type-Description': str(row.get('Type-Description', '')),
                            'Serial no.': str(row.get('Serial no.', '')),
                            'Manufacturer': str(row.get('Manufacturer', '')),
                            'Location': str(row.get('Location', '')),
                            'InternalNo': str(row.get('InternalNo', '')),
                            'Next Due Date': pd.to_datetime(row.get('Next Due Date'), errors='coerce')
                        })
                
                current_equipment_data = equipment_data
                last_uploaded_file = filename
                
                return jsonify({
                    'message': f'File {filename} uploaded and processed successfully (fallback mode)',
                    'equipment_count': len(equipment_data),
                    'filename': filename
                })
                
            except Exception as e:
                return jsonify({'error': f'Error processing file: {str(e)}'}), 500
        
    except Exception as e:
        return jsonify({'error': f'Error uploading file: {str(e)}'}), 500

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get current alerts based on equipment data"""
    global current_equipment_data
    
    if not current_equipment_data:
        return jsonify({
            'alerts': [],
            'count': 0,
            'message': 'No equipment data available'
        })
    
    try:
        if ALERT_SYSTEM_AVAILABLE and alert_manager:
            alerts = alert_manager.check_due_dates(current_equipment_data)
            return jsonify({
                'alerts': alerts,
                'count': len(alerts),
                'threshold_days': alert_manager.threshold_days
            })
        else:
            # Fallback alert logic
            alerts = []
            today = datetime.now()
            
            for equipment in current_equipment_data:
                due_date = equipment.get('Next Due Date')
                if due_date and isinstance(due_date, datetime):
                    days_until_due = (due_date - today).days
                    if days_until_due <= 30:  # Default threshold
                        alerts.append({
                            'equipment': equipment,
                            'days_until_due': days_until_due,
                            'status': 'OVERDUE' if days_until_due < 0 else 'DUE_SOON'
                        })
            
            return jsonify({
                'alerts': alerts,
                'count': len(alerts),
                'threshold_days': 30
            })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get calibration statistics"""
    global current_equipment_data
    
    if not current_equipment_data:
        return jsonify({
            'total': 0,
            'overdue': 0,
            'due_soon': 0,
            'up_to_date': 0
        })
    
    try:
        today = datetime.now()
        stats = {
            'total': len(current_equipment_data),
            'overdue': 0,
            'due_soon': 0,
            'up_to_date': 0
        }
        
        for equipment in current_equipment_data:
            due_date = equipment.get('Next Due Date')
            if due_date and isinstance(due_date, datetime):
                days_until_due = (due_date - today).days
                if days_until_due < 0:
                    stats['overdue'] += 1
                elif days_until_due <= 30:
                    stats['due_soon'] += 1
                else:
                    stats['up_to_date'] += 1
            else:
                stats['up_to_date'] += 1  # Assume up to date if no valid date
        
        return jsonify(stats)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/send-alerts', methods=['POST'])
def send_alerts():
    """Send email alerts for equipment due for calibration"""
    try:
        data = request.get_json()
        recipients = data.get('recipients', [])
        threshold = data.get('threshold', 30)
        
        if not recipients:
            return jsonify({'error': 'No recipients specified'}), 400
        
        if not current_equipment_data:
            return jsonify({'error': 'No equipment data available'}), 400
        
        # Get alerts
        if ALERT_SYSTEM_AVAILABLE and alert_manager:
            alert_manager.threshold_days = threshold
            alerts = alert_manager.check_due_dates(current_equipment_data)
            
            if alerts:
                # Format email content
                html_content = alert_manager.format_alert_message(alerts)
                
                # In a real implementation, you would send the email here
                # For now, we'll just return the formatted content
                return jsonify({
                    'message': f'Alert email prepared for {len(recipients)} recipients',
                    'alert_count': len(alerts),
                    'recipients': recipients,
                    'html_preview': html_content[:500] + '...' if len(html_content) > 500 else html_content
                })
            else:
                return jsonify({
                    'message': 'No alerts to send - all equipment is up to date',
                    'alert_count': 0,
                    'recipients': recipients
                })
        else:
            return jsonify({
                'message': 'Alert system not available - email functionality disabled',
                'alert_count': 0,
                'recipients': recipients
            })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/equipment/<int:equipment_id>', methods=['PUT'])
def update_equipment(equipment_id):
    """Update existing equipment by index"""
    try:
        global current_equipment_data
        
        if equipment_id < 0 or equipment_id >= len(current_equipment_data):
            return jsonify({'error': 'Equipment not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['Type-Description', 'Serial no.', 'Manufacturer', 'Location', 'InternalNo', 'Next Due Date']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Parse the date
        try:
            if isinstance(data['Next Due Date'], str):
                due_date = datetime.strptime(data['Next Due Date'], '%Y-%m-%d')
                data['Next Due Date'] = due_date
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Update the equipment
        current_equipment_data[equipment_id] = data
        
        return jsonify({
            'message': 'Equipment updated successfully',
            'equipment': process_equipment_data([data])[0]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/equipment/<int:equipment_id>', methods=['DELETE'])
def delete_equipment(equipment_id):
    """Delete equipment by index"""
    try:
        global current_equipment_data
        
        if equipment_id < 0 or equipment_id >= len(current_equipment_data):
            return jsonify({'error': 'Equipment not found'}), 404
        
        # Get the equipment info for response
        deleted_equipment = current_equipment_data[equipment_id]
        
        # Remove the equipment
        current_equipment_data.pop(equipment_id)
        
        return jsonify({
            'message': 'Equipment deleted successfully',
            'deleted_equipment': process_equipment_data([deleted_equipment])[0],
            'remaining_count': len(current_equipment_data)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/config', methods=['GET', 'POST'])
def manage_config():
    """Get or update system configuration"""
    if request.method == 'GET':
        return jsonify({
            'alert_threshold_days': alert_manager.threshold_days if alert_manager else 30,
            'alert_system_available': ALERT_SYSTEM_AVAILABLE,
            'last_uploaded_file': last_uploaded_file,
            'equipment_count': len(current_equipment_data)
        })
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            
            if 'alert_threshold_days' in data and alert_manager:
                alert_manager.threshold_days = int(data['alert_threshold_days'])
            
            return jsonify({
                'message': 'Configuration updated successfully',
                'alert_threshold_days': alert_manager.threshold_days if alert_manager else 30
            })
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting LEONI Calibration Alert API...")
    print(f"📊 Alert System Available: {ALERT_SYSTEM_AVAILABLE}")
    print(f"📁 Upload Directory: {UPLOAD_FOLDER}")
    print("🌐 API will be available at: http://localhost:5000")
    print("📋 Available endpoints:")
    print("   - GET  /api/health")
    print("   - GET  /api/equipment")
    print("   - POST /api/equipment (add new equipment)")
    print("   - PUT  /api/equipment/<id> (update equipment)")
    print("   - DELETE /api/equipment/<id> (delete equipment)")
    print("   - POST /api/upload")
    print("   - GET  /api/alerts")
    print("   - GET  /api/statistics")
    print("   - POST /api/send-alerts")
    print("   - GET/POST /api/config")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
