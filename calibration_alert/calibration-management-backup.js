// Equipment Calibration Management System
// JavaScript functionality for team leader dashboard

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let equipmentData = [];
let alertThreshold = 30;
let lastUpdateTime = null;
let apiAvailable = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeCalibrationSystem();
    checkApiConnection();
    loadEquipmentData();
    updateDisplay();
});

// Check if API is available
async function checkApiConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            apiAvailable = true;
            console.log('✅ API connection established');
            document.getElementById('apiStatus').textContent = 'Connected';
            document.getElementById('apiStatus').className = 'status-indicator status-connected';
        } else {
            throw new Error('API not responding');
        }
    } catch (error) {
        apiAvailable = false;
        console.log('⚠️ API not available, using mock data');
        document.getElementById('apiStatus').textContent = 'Offline (Mock Data)';
        document.getElementById('apiStatus').className = 'status-indicator status-offline';
        loadMockData(); // Fallback to mock data
    }
}

// Initialize the calibration management system
function initializeCalibrationSystem() {
    console.log('🔧 LEONI Calibration Management System Initialized');
    
    // Set default values
    document.getElementById('alertThreshold').value = alertThreshold;
    document.getElementById('emailRecipients').value = 'team.leader@leoni.com, quality.manager@leoni.com';
    
    // Add event listeners
    document.getElementById('alertThreshold').addEventListener('change', function() {
        alertThreshold = parseInt(this.value);
        updateDisplay();
    });
    
    // Set up drag and drop for file upload
    setupFileUpload();
}

// Load equipment data from API or fallback to mock data
async function loadEquipmentData() {
    if (apiAvailable) {
        try {
            const response = await fetch(`${API_BASE_URL}/equipment`);
            if (response.ok) {
                const data = await response.json();
                equipmentData = data.equipment.map(item => ({
                    ...item,
                    'Next Due Date': new Date(item['Next Due Date'])
                }));
                lastUpdateTime = new Date();
                console.log(`📊 Loaded ${equipmentData.length} equipment records from API`);
                
                // Show the table container and hide loading spinner
                const tableContainer = document.getElementById('tableContainer');
                const loadingSpinner = document.getElementById('loadingSpinner');
                if (tableContainer) tableContainer.style.display = 'block';
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                
                return;
            }
        } catch (error) {
            console.error('Failed to load from API:', error);
        }
    }
    
    // Fallback to mock data
    loadMockData();
}

// Load mock equipment data for demonstration (fallback when API is not available)
function loadMockData() {
    const today = new Date();
    
    equipmentData = [
        {
            'Type-Description': 'Digital Multimeter',
            'Serial no.': 'DMM-001',
            'Manufacturer': 'Fluke',
            'Location': 'Lab A - Station 1',
            'InternalNo': 'LEONI-001',
            'Next Due Date': new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000) // 5 days overdue
        },
        {
            'Type-Description': 'Oscilloscope',
            'Serial no.': 'OSC-002',
            'Manufacturer': 'Keysight',
            'Location': 'Lab A - Station 2',
            'InternalNo': 'LEONI-002',
            'Next Due Date': new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000) // 15 days remaining
        },
        {
            'Type-Description': 'Power Supply',
            'Serial no.': 'PSU-003',
            'Manufacturer': 'Rigol',
            'Location': 'Lab B - Station 1',
            'InternalNo': 'LEONI-003',
            'Next Due Date': new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000) // 45 days remaining
        },
        {
            'Type-Description': 'Function Generator',
            'Serial no.': 'FG-004',
            'Manufacturer': 'Tektronix',
            'Location': 'Lab B - Station 2',
            'InternalNo': 'LEONI-004',
            'Next Due Date': new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 days remaining
        },
        {
            'Type-Description': 'Spectrum Analyzer',
            'Serial no.': 'SA-005',
            'Manufacturer': 'Rohde & Schwarz',
            'Location': 'Lab C - Station 1',
            'InternalNo': 'LEONI-005',
            'Next Due Date': new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000) // 2 days overdue
        },
        {
            'Type-Description': 'LCR Meter',
            'Serial no.': 'LCR-006',
            'Manufacturer': 'Keysight',
            'Location': 'Lab C - Station 2',
            'InternalNo': 'LEONI-006',
            'Next Due Date': new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000) // 90 days remaining
        }
    ];
    
    lastUpdateTime = new Date();
    console.log(`📊 Loaded ${equipmentData.length} equipment records`);
}

// Update the display with current data
function updateDisplay() {
    updateStatistics();
    updateEquipmentTable();
    updateLastUpdated();
    checkForAlerts();
}

// Update statistics cards
function updateStatistics() {
    const today = new Date();
    let overdueCount = 0;
    let dueSoonCount = 0;
    let goodCount = 0;
    
    equipmentData.forEach(equipment => {
        const dueDate = equipment['Next Due Date'];
        if (dueDate) {
            const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
            
            if (daysUntilDue < 0) {
                overdueCount++;
            } else if (daysUntilDue <= alertThreshold) {
                dueSoonCount++;
            } else {
                goodCount++;
            }
        }
    });
    
    document.getElementById('overdueCount').textContent = overdueCount;
    document.getElementById('dueSoonCount').textContent = dueSoonCount;
    document.getElementById('goodCount').textContent = goodCount;
    document.getElementById('totalCount').textContent = equipmentData.length;
}

// Update equipment table
function updateEquipmentTable() {
    const tableBody = document.getElementById('equipmentTableBody');
    const tableContainer = document.getElementById('tableContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Show loading
    loadingSpinner.style.display = 'block';
    tableContainer.style.display = 'none';
    
    // Simulate loading delay
    setTimeout(() => {
        tableBody.innerHTML = '';
        const today = new Date();
        
        // Sort equipment by status (overdue first, then by days remaining)
        const sortedEquipment = [...equipmentData].sort((a, b) => {
            const aDays = Math.floor((a['Next Due Date'] - today) / (1000 * 60 * 60 * 24));
            const bDays = Math.floor((b['Next Due Date'] - today) / (1000 * 60 * 60 * 24));
            return aDays - bDays;
        });
        
        sortedEquipment.forEach(equipment => {
            const row = createEquipmentRow(equipment, today);
            tableBody.appendChild(row);
        });
        
        // Hide loading and show table
        loadingSpinner.style.display = 'none';
        tableContainer.style.display = 'block';
    }, 1000);
}

// Create equipment table row
function createEquipmentRow(equipment, today) {
    const row = document.createElement('tr');
    const dueDate = equipment['Next Due Date'];
    const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
    
    let statusClass, statusText, daysText;
    
    if (daysUntilDue < 0) {
        statusClass = 'status-overdue';
        statusText = 'OVERDUE';
        daysText = `${Math.abs(daysUntilDue)} days overdue`;
    } else if (daysUntilDue <= alertThreshold) {
        statusClass = 'status-due-soon';
        statusText = 'DUE SOON';
        daysText = `${daysUntilDue} days remaining`;
    } else {
        statusClass = 'status-good';
        statusText = 'UP TO DATE';
        daysText = `${daysUntilDue} days remaining`;
    }
    
    row.innerHTML = `
        <td>${equipment['Type-Description'] || 'N/A'}</td>
        <td>${equipment['Serial no.'] || 'N/A'}</td>
        <td>${equipment['Manufacturer'] || 'N/A'}</td>
        <td>${equipment['Location'] || 'N/A'}</td>
        <td>${equipment['InternalNo'] || 'N/A'}</td>
        <td>${dueDate ? dueDate.toLocaleDateString() : 'N/A'}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>${daysText}</td>
    `;
    
    return row;
}

// Check for alerts and show alert panel if needed
function checkForAlerts() {
    const today = new Date();
    let alertCount = 0;
    
    equipmentData.forEach(equipment => {
        const dueDate = equipment['Next Due Date'];
        if (dueDate) {
            const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
            if (daysUntilDue <= alertThreshold) {
                alertCount++;
            }
        }
    });
    
    const alertSection = document.getElementById('alertSection');
    const alertCountElement = document.getElementById('alertCount');
    
    if (alertCount > 0) {
        alertCountElement.textContent = alertCount;
        alertSection.style.display = 'block';
    } else {
        alertSection.style.display = 'none';
    }
    
    console.log(`🚨 Found ${alertCount} equipment items requiring attention`);
}

// Update last updated time
function updateLastUpdated() {
    if (lastUpdateTime) {
        document.getElementById('lastUpdated').textContent = lastUpdateTime.toLocaleString();
    }
}

// Check alerts function (called by button)
function checkAlerts() {
    showSuccessMessage('Checking for calibration alerts...');
    
    // Simulate API call
    setTimeout(() => {
        updateDisplay();
        showSuccessMessage('Alert check completed successfully');
    }, 1500);
}

// Send alerts function with API integration
async function sendAlerts() {
    const recipients = document.getElementById('emailRecipients').value;
    if (!recipients.trim()) {
        alert('Please enter email recipients');
        return;
    }
    
    const recipientsList = recipients.split(',').map(email => email.trim()).filter(email => email);
    
    if (apiAvailable) {
        try {
            showSuccessMessage('Sending alert emails...');
            
            const response = await fetch(`${API_BASE_URL}/send-alerts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recipients: recipientsList,
                    threshold: alertThreshold
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showSuccessMessage(result.message);
                console.log('✅ Email alerts processed successfully');
            } else {
                throw new Error(result.error || 'Failed to send alerts');
            }
        } catch (error) {
            console.error('Email alert error:', error);
            showSuccessMessage(`Failed to send email alerts: ${error.message}`);
        }
    } else {
        // Fallback simulation when API is not available
        showSuccessMessage('Sending alert emails...');
        
        setTimeout(() => {
            const today = new Date();
            let alertCount = 0;
            
            equipmentData.forEach(equipment => {
                const dueDate = equipment['Next Due Date'];
                if (dueDate) {
                    const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
                    if (daysUntilDue <= alertThreshold) {
                        alertCount++;
                    }
                }
            });
            
            if (alertCount > 0) {
                showSuccessMessage(`Alert emails simulated for ${recipientsList.length} recipients and ${alertCount} equipment items (API offline)`);
            } else {
                showSuccessMessage('No alerts to send - all equipment is up to date');
            }
        }, 2000);
    }
}

// Update data function with API integration
async function updateData() {
    showSuccessMessage('Updating equipment data...');
    
    if (apiAvailable) {
        await loadEquipmentData();
        updateDisplay();
        showSuccessMessage('Equipment data updated successfully');
    } else {
        // Simulate data update when API not available
        setTimeout(() => {
            lastUpdateTime = new Date();
            updateDisplay();
            showSuccessMessage('Equipment data updated successfully (using mock data)');
        }, 1500);
    }
}

// Download report function
function downloadReport() {
    showSuccessMessage('Generating calibration report...');
    
    // Simulate report generation
    setTimeout(() => {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        // Create CSV content
        let csvContent = 'Equipment Type,Serial Number,Manufacturer,Location,Internal No,Next Due Date,Status,Days Remaining\\n';
        
        equipmentData.forEach(equipment => {
            const dueDate = equipment['Next Due Date'];
            const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
            
            let status;
            if (daysUntilDue < 0) {
                status = 'OVERDUE';
            } else if (daysUntilDue <= alertThreshold) {
                status = 'DUE SOON';
            } else {
                status = 'UP TO DATE';
            }
            
            csvContent += `"${equipment['Type-Description']}","${equipment['Serial no.']}","${equipment['Manufacturer']}","${equipment['Location']}","${equipment['InternalNo']}","${dueDate.toLocaleDateString()}","${status}","${daysUntilDue}"\\n`;
        });
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `LEONI_Calibration_Report_${dateStr}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        showSuccessMessage('Calibration report downloaded successfully');
    }, 1500);
}

// Handle file upload with API integration
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.match(/\.(xls|xlsx)$/)) {
        alert('Please select a valid Excel file (.xls or .xlsx)');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
    }
    
    showSuccessMessage(`Uploading file: ${file.name}...`);
    
    if (apiAvailable) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                console.log('✅ File uploaded successfully:', result.message);
                await loadEquipmentData(); // Reload data from API
                updateDisplay();
                showSuccessMessage(result.message);
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showSuccessMessage(`Upload failed: ${error.message}`);
        }
    } else {
        // Simulate file upload and processing when API not available
        setTimeout(() => {
            // In production, this would process the actual Excel file
            // For now, we'll just reload mock data
            loadMockData();
            updateDisplay();
            showSuccessMessage(`File "${file.name}" processed (using mock data - API not available)`);
        }, 2000);
    }
}

// Setup file upload drag and drop
function setupFileUpload() {
    const uploadArea = document.querySelector('.file-upload-area');
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--leoni-primary)';
        this.style.backgroundColor = 'var(--leoni-blue-light)';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--leoni-primary-light)';
        this.style.backgroundColor = 'var(--leoni-gray-50)';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--leoni-primary-light)';
        this.style.backgroundColor = 'var(--leoni-gray-50)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            document.getElementById('fileInput').files = files;
            handleFileUpload({ target: { files: files } });
        }
    });
}

// Show success message
function showSuccessMessage(message) {
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    
    successText.textContent = message;
    successMessage.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// ========================================
// CRUD Operations for Equipment Management
// ========================================

// Display equipment data in the table with CRUD controls
function displayEquipmentTable() {
    const tableBody = document.getElementById('equipmentTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (equipmentData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; color: #64748b; padding: 40px;">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                    No equipment data available. Upload an Excel file or add equipment manually.
                </td>
            </tr>
        `;
        return;
    }
    
    equipmentData.forEach((equipment, index) => {
        const row = createEquipmentRow(equipment, index);
        tableBody.appendChild(row);
    });
    
    console.log(`📋 Displayed ${equipmentData.length} equipment records`);
}

// Create a table row for equipment with action buttons
function createEquipmentRow(equipment, index) {
    const row = document.createElement('tr');
    row.setAttribute('data-index', index);
    
    const dueDate = new Date(equipment['Next Due Date']);
    const today = new Date();
    const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    // Determine status
    let statusClass, statusText;
    if (daysRemaining < 0) {
        statusClass = 'status-overdue';
        statusText = 'OVERDUE';
    } else if (daysRemaining <= alertThreshold) {
        statusClass = 'status-due-soon';
        statusText = 'DUE SOON';
    } else {
        statusClass = 'status-good';
        statusText = 'UP TO DATE';
    }
    
    row.innerHTML = `
        <td class="equipment-type">${escapeHtml(equipment['Type-Description'] || '')}</td>
        <td class="serial-number">${escapeHtml(equipment['Serial no.'] || '')}</td>
        <td class="manufacturer">${escapeHtml(equipment['Manufacturer'] || '')}</td>
        <td class="location">${escapeHtml(equipment['Location'] || '')}</td>
        <td class="internal-number">${escapeHtml(equipment['InternalNo'] || '')}</td>
        <td class="due-date">${formatDate(dueDate)}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td class="days-remaining" style="font-weight: 600; color: ${daysRemaining < 0 ? '#dc2626' : daysRemaining <= alertThreshold ? '#d97706' : '#059669'}">
            ${daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
        </td>
        <td class="actions">
            <button class="action-btn edit" onclick="editEquipment(${index})" title="Edit Equipment">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="action-btn delete" onclick="deleteEquipment(${index})" title="Delete Equipment">
                <i class="fas fa-trash"></i> Delete
            </button>
        </td>
    `;
    
    return row;
}

// Edit equipment inline
function editEquipment(index) {
    const row = document.querySelector(`tr[data-index="${index}"]`);
    if (!row) return;
    
    const equipment = equipmentData[index];
    const cells = row.querySelectorAll('td');
    
    // Make cells editable (except status, days remaining, and actions)
    cells[0].innerHTML = `<input type="text" value="${escapeHtml(equipment['Type-Description'])}" class="edit-input">`;
    cells[1].innerHTML = `<input type="text" value="${escapeHtml(equipment['Serial no.'])}" class="edit-input">`;
    cells[2].innerHTML = `<input type="text" value="${escapeHtml(equipment['Manufacturer'])}" class="edit-input">`;
    cells[3].innerHTML = `<input type="text" value="${escapeHtml(equipment['Location'])}" class="edit-input">`;
    cells[4].innerHTML = `<input type="text" value="${escapeHtml(equipment['InternalNo'])}" class="edit-input">`;
    cells[5].innerHTML = `<input type="date" value="${formatDateForInput(new Date(equipment['Next Due Date']))}" class="edit-input">`;
    
    // Update action buttons
    cells[8].innerHTML = `
        <button class="action-btn save" onclick="saveEquipment(${index})" title="Save Changes">
            <i class="fas fa-save"></i> Save
        </button>
        <button class="action-btn cancel" onclick="cancelEdit(${index})" title="Cancel Edit">
            <i class="fas fa-times"></i> Cancel
        </button>
    `;
    
    // Add editing class for styling
    cells.forEach((cell, i) => {
        if (i < 6) cell.classList.add('editing-cell');
    });
}

// Save equipment changes
async function saveEquipment(index) {
    const row = document.querySelector(`tr[data-index="${index}"]`);
    if (!row) return;
    
    try {
        // Get values from input fields
        const inputs = row.querySelectorAll('.edit-input');
        const updatedEquipment = {
            'Type-Description': inputs[0].value.trim(),
            'Serial no.': inputs[1].value.trim(),
            'Manufacturer': inputs[2].value.trim(),
            'Location': inputs[3].value.trim(),
            'InternalNo': inputs[4].value.trim(),
            'Next Due Date': inputs[5].value
        };
        
        // Validate required fields
        if (!updatedEquipment['Type-Description'] || !updatedEquipment['Serial no.'] || 
            !updatedEquipment['Manufacturer'] || !updatedEquipment['Location'] || 
            !updatedEquipment['InternalNo'] || !updatedEquipment['Next Due Date']) {
            showMessage('All fields are required', 'error');
            return;
        }
        
        // Update local data
        equipmentData[index] = {
            ...updatedEquipment,
            'Next Due Date': new Date(updatedEquipment['Next Due Date'])
        };
        
        // Update via API if available
        if (apiAvailable) {
            const response = await fetch(`${API_BASE_URL}/equipment/${index}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEquipment)
            });
            
            if (!response.ok) {
                console.warn('Failed to update equipment via API, changes saved locally only');
            }
        }
        
        // Refresh the table
        displayEquipmentTable();
        updateStatistics();
        showMessage('Equipment updated successfully', 'success');
        
    } catch (error) {
        console.error('Error saving equipment:', error);
        showMessage('Error saving equipment changes', 'error');
    }
}

// Cancel editing
function cancelEdit(index) {
    displayEquipmentTable(); // Simply redraw the table to cancel changes
}

// Delete equipment
async function deleteEquipment(index) {
    const equipment = equipmentData[index];
    
    if (!confirm(`Are you sure you want to delete "${equipment['Type-Description']}" (${equipment['Serial no.']})?`)) {
        return;
    }
    
    try {
        // Remove from local data
        equipmentData.splice(index, 1);
        
        // Delete via API if available
        if (apiAvailable) {
            const response = await fetch(`${API_BASE_URL}/equipment/${index}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                console.warn('Failed to delete equipment via API, deleted locally only');
            }
        }
        
        // Refresh the table
        displayEquipmentTable();
        updateStatistics();
        showMessage('Equipment deleted successfully', 'success');
        
    } catch (error) {
        console.error('Error deleting equipment:', error);
        showMessage('Error deleting equipment', 'error');
    }
}

// Add new equipment
async function addNewEquipment(event) {
    event.preventDefault();
    
    try {
        const form = event.target;
        const formData = new FormData(form);
        
        const newEquipment = {
            'Type-Description': document.getElementById('newEquipmentType').value.trim(),
            'Serial no.': document.getElementById('newSerialNumber').value.trim(),
            'Manufacturer': document.getElementById('newManufacturer').value.trim(),
            'Location': document.getElementById('newLocation').value.trim(),
            'InternalNo': document.getElementById('newInternalNo').value.trim(),
            'Next Due Date': document.getElementById('newDueDate').value
        };
        
        // Validate required fields
        if (!newEquipment['Type-Description'] || !newEquipment['Serial no.'] || 
            !newEquipment['Manufacturer'] || !newEquipment['Location'] || 
            !newEquipment['InternalNo'] || !newEquipment['Next Due Date']) {
            showMessage('All fields are required', 'error');
            return;
        }
        
        // Check for duplicate serial number
        const existingEquipment = equipmentData.find(eq => eq['Serial no.'] === newEquipment['Serial no.']);
        if (existingEquipment) {
            showMessage('Equipment with this serial number already exists', 'error');
            return;
        }
        
        // Add to local data
        const equipmentWithDate = {
            ...newEquipment,
            'Next Due Date': new Date(newEquipment['Next Due Date'])
        };
        
        // Add via API if available
        if (apiAvailable) {
            const response = await fetch(`${API_BASE_URL}/equipment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEquipment)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Equipment added via API:', result);
            } else {
                console.warn('Failed to add equipment via API, added locally only');
            }
        }
        
        equipmentData.push(equipmentWithDate);
        
        // Reset form and hide it
        resetNewEquipmentForm();
        toggleNewEquipmentForm();
        
        // Refresh display
        displayEquipmentTable();
        updateStatistics();
        showMessage('Equipment added successfully', 'success');
        
    } catch (error) {
        console.error('Error adding equipment:', error);
        showMessage('Error adding equipment', 'error');
    }
}

// Toggle new equipment form
function toggleNewEquipmentForm() {
    const form = document.getElementById('newEquipmentForm');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        // Set minimum date to today
        document.getElementById('newDueDate').min = new Date().toISOString().split('T')[0];
    } else {
        form.style.display = 'none';
    }
}

// Reset new equipment form
function resetNewEquipmentForm() {
    document.getElementById('newEquipmentType').value = '';
    document.getElementById('newSerialNumber').value = '';
    document.getElementById('newManufacturer').value = '';
    document.getElementById('newLocation').value = '';
    document.getElementById('newInternalNo').value = '';
    document.getElementById('newDueDate').value = '';
}

// ========================================
// File Upload with Drag & Drop
// ========================================

// Handle file upload
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    await uploadFile(file);
}

// Upload file to API
async function uploadFile(file) {
    try {
        // Validate file type
        const allowedTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        
        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx)$/i)) {
            showMessage('Invalid file type. Please upload an Excel file (.xls or .xlsx)', 'error');
            return;
        }
        
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            showMessage('File too large. Maximum size is 10MB', 'error');
            return;
        }
        
        showMessage('Uploading file...', 'info');
        
        const formData = new FormData();
        formData.append('file', file);
        
        if (apiAvailable) {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                showMessage(`File uploaded successfully! Processed ${result.equipment_count} equipment records.`, 'success');
                await loadEquipmentData(); // Reload data from API
                updateDisplay(); // Update entire display including table
            } else {
                const error = await response.json();
                showMessage(`Upload failed: ${error.error}`, 'error');
            }
        } else {
            // Mock file processing for demo
            showMessage('API not available. File upload simulated with mock data.', 'warning');
            loadMockData();
            displayEquipmentTable();
            updateStatistics();
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        showMessage('Error uploading file. Please try again.', 'error');
    }
    
    // Reset file input
    document.getElementById('fileInput').value = '';
}

// ========================================
// Utility Functions
// ========================================

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format date for display
function formatDate(date) {
    if (!date || !(date instanceof Date)) return 'N/A';
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format date for input field
function formatDateForInput(date) {
    if (!date || !(date instanceof Date)) return '';
    return date.toISOString().split('T')[0];
}

// Show message to user
function showMessage(message, type = 'info') {
    const messageElement = document.getElementById('successMessage');
    const textElement = document.getElementById('successText');
    
    if (messageElement && textElement) {
        textElement.textContent = message;
        
        // Update styling based on type
        messageElement.className = 'success-message';
        if (type === 'error') {
            messageElement.style.background = 'linear-gradient(135deg, #fef2f2, #ffffff)';
            messageElement.style.borderColor = '#fca5a5';
            messageElement.querySelector('i').className = 'fas fa-exclamation-circle';
            messageElement.querySelector('i').style.color = '#dc2626';
        } else if (type === 'warning') {
            messageElement.style.background = 'linear-gradient(135deg, #fffbeb, #ffffff)';
            messageElement.style.borderColor = '#fed7aa';
            messageElement.querySelector('i').className = 'fas fa-exclamation-triangle';
            messageElement.querySelector('i').style.color = '#d97706';
        } else {
            messageElement.style.background = 'linear-gradient(135deg, #f0fdf4, #ffffff)';
            messageElement.style.borderColor = '#86efac';
            messageElement.querySelector('i').className = 'fas fa-check-circle';
            messageElement.querySelector('i').style.color = '#059669';
        }
        
        messageElement.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

// Setup drag and drop for file upload
function setupFileUpload() {
    const uploadArea = document.querySelector('.file-upload-area');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight(e) {
        uploadArea.classList.add('drag-over');
    }
    
    function unhighlight(e) {
        uploadArea.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    }
}

// Auto-refresh data every 5 minutes
setInterval(() => {
    console.log('🔄 Auto-refreshing calibration data...');
    updateData();
}, 5 * 60 * 1000);

console.log('✅ LEONI Calibration Management System loaded successfully');
