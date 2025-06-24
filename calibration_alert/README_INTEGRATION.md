# Equipment Calibration Management System

## Overview

This system integrates the existing Python-based calibration alert system with the LEONI Quality Management System (QMS) web interface, providing team leaders with a comprehensive dashboard for monitoring and managing laboratory equipment calibration schedules.

## Features

### Web Interface (`calibration-management.html`)
- **Dashboard Overview**: Real-time statistics showing overdue, due soon, and up-to-date equipment
- **Equipment Table**: Detailed view of all equipment with calibration status
- **File Upload**: Drag & drop Excel file upload for equipment data
- **Alert Management**: Configure alert thresholds and email recipients
- **Email Notifications**: Send alerts for equipment requiring calibration
- **Responsive Design**: Fully responsive interface following LEONI design standards

### Python API Backend (`calibration_api.py`)
- **Flask REST API**: RESTful API endpoints for web interface integration
- **Excel Processing**: Automatic processing of uploaded Excel files
- **Alert Generation**: Smart alert logic based on calibration due dates
- **Email Integration**: Prepared for SMTP email alert functionality
- **Data Management**: Centralized equipment data management

### Existing Alert System Integration
- **Core Logic**: Utilizes existing Python modules for alert management
- **Data Processing**: Reuses Excel reader and data processor components
- **Email System**: Integrates with existing email sender infrastructure
- **Configuration**: Maintains existing environment-based configuration

## Architecture

```
┌─────────────────────────────────────┐
│        Web Interface (HTML/JS)      │
│  ┌─────────────────────────────────┐ │
│  │  Calibration Management         │ │
│  │  Dashboard                      │ │
│  └─────────────────────────────────┘ │
└─────────────────┬───────────────────┘
                  │ HTTP API Calls
                  │ (REST/JSON)
┌─────────────────▼───────────────────┐
│         Flask API Server            │
│  ┌─────────────────────────────────┐ │
│  │  calibration_api.py             │ │
│  │  - File upload endpoints        │ │
│  │  - Equipment data API           │ │
│  │  - Alert management API         │ │
│  │  - Configuration API            │ │
│  └─────────────────────────────────┘ │
└─────────────────┬───────────────────┘
                  │ Python Imports
                  │
┌─────────────────▼───────────────────┐
│    Existing Alert System            │
│  ┌─────────────────────────────────┐ │
│  │  Alert_System_Automation/       │ │
│  │  - excel_reader.py              │ │
│  │  - alert_manager.py             │ │
│  │  - email_sender.py              │ │
│  │  - data_processor.py            │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Files Structure

```
calibration_alert/
├── calibration-management.html    # Team leader web interface
├── calibration-management.js      # Frontend JavaScript logic
├── calibration_api.py            # Flask API backend
├── requirements_api.txt          # Python dependencies for API
├── start_api.sh                  # API startup script
├── uploads/                      # Directory for uploaded Excel files
└── Calibration Alert System/     # Existing Python alert system
    └── Alert_System_Automation/
        ├── src/
        │   ├── main.py
        │   ├── excel_reader.py
        │   ├── alert_manager.py
        │   ├── email_sender.py
        │   └── data_processor.py
        ├── data/
        │   └── laboratory_measures.xls
        ├── config/
        └── requirements.txt
```

## Setup Instructions

### 1. Prerequisites
- Python 3.8+
- Modern web browser
- Excel files with equipment calibration data

### 2. API Setup
```bash
# Navigate to the calibration_alert directory
cd "Fun Games/calibration_alert"

# Run the setup script
./start_api.sh
```

### 3. Web Interface Access
1. Start the Flask API (using `start_api.sh` or manually)
2. Open `calibration-management.html` in a web browser
3. The interface will automatically detect API availability

### 4. Configuration
- **Alert Threshold**: Set the number of days before due date to trigger alerts
- **Email Recipients**: Configure email addresses for alert notifications
- **SMTP Settings**: Configure email server settings in the Alert System `.env` file

## Usage

### For Team Leaders

1. **Dashboard Access**: Open the calibration management page
2. **Upload Data**: Drag and drop Excel files containing equipment data
3. **Monitor Status**: Review equipment calibration status in real-time
4. **Configure Alerts**: Set alert thresholds and recipient lists
5. **Send Notifications**: Trigger email alerts for due equipment

### Data Format

The system expects Excel files with the following columns:
- `Type-Description`: Equipment type and description
- `Serial no.`: Equipment serial number
- `Manufacturer`: Equipment manufacturer
- `Location`: Physical location of equipment
- `InternalNo`: Internal tracking number
- `Next Due Date`: Next calibration due date

### API Endpoints

- `GET /api/health` - System health check
- `GET /api/equipment` - Get all equipment data
- `GET /api/alerts` - Get current alerts
- `GET /api/statistics` - Get calibration statistics
- `POST /api/upload` - Upload Excel file
- `POST /api/send-alerts` - Send email alerts
- `GET/POST /api/config` - Manage system configuration

## Integration with QMS

This calibration management system is integrated into the LEONI Quality Management System:

- **Navigation**: Accessible from the main QMS dashboard
- **Design Consistency**: Follows LEONI design standards and color palette
- **User Access**: Designed for team leader and quality management roles
- **Data Integration**: Can be extended to integrate with other QMS modules

## Troubleshooting

### API Connection Issues
- Ensure Flask API is running on `http://localhost:5000`
- Check console for connection errors
- Interface falls back to mock data when API is unavailable

### File Upload Issues
- Verify file format (Excel .xls or .xlsx)
- Check file size (max 10MB)
- Ensure required columns are present

### Email Alerts
- Configure SMTP settings in the Alert System `.env` file
- Verify email recipient addresses
- Check email server connectivity

## Future Enhancements

- **Database Integration**: Persistent storage for equipment data
- **User Authentication**: Role-based access control
- **Advanced Reporting**: Detailed calibration reports and analytics
- **Mobile App**: Mobile interface for field technicians
- **Integration APIs**: Connect with other lab management systems

## Support

For technical support or questions about the calibration management system, please contact the LEONI Quality Management team.
