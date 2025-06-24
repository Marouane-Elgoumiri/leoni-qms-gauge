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

// Utility function to format dates
function formatDate(date) {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Utility function to calculate days difference
function daysDifference(date1, date2) {
    const timeDiff = date1.getTime() - date2.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
}

// New Equipment Form Functions
function toggleNewEquipmentForm() {
    const form = document.getElementById('newEquipmentForm');
    const isVisible = form.style.display !== 'none';
    form.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
        // Set default date to today + 365 days (1 year from now)
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        document.getElementById('newDueDate').value = nextYear.toISOString().split('T')[0];
    }
}

function resetNewEquipmentForm() {
    document.getElementById('newEquipmentType').value = '';
    document.getElementById('newSerialNumber').value = '';
    document.getElementById('newManufacturer').value = '';
    document.getElementById('newLocation').value = '';
    document.getElementById('newInternalNo').value = '';
    
    // Set default date to today + 365 days
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    document.getElementById('newDueDate').value = nextYear.toISOString().split('T')[0];
}

async function addNewEquipment(event) {
    event.preventDefault();
    
    const newEquipmentData = {
        'Type-Description': document.getElementById('newEquipmentType').value,
        'Serial no.': document.getElementById('newSerialNumber').value,
        'Manufacturer': document.getElementById('newManufacturer').value,
        'Location': document.getElementById('newLocation').value,
        'InternalNo': document.getElementById('newInternalNo').value,
        'Next Due Date': document.getElementById('newDueDate').value
    };
    
    // Validate all fields are filled
    for (const [key, value] of Object.entries(newEquipmentData)) {
        if (!value || value.trim() === '') {
            alert(`Please fill in the ${key} field`);
            return;
        }
    }
    
    if (apiAvailable) {
        try {
            showSuccessMessage('Adding new equipment...');
            
            const response = await fetch(`${API_BASE_URL}/equipment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEquipmentData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showSuccessMessage(`Equipment "${newEquipmentData['Type-Description']}" added successfully!`);
                
                // Add to local data and refresh display
                const newEquipment = {
                    ...newEquipmentData,
                    'Next Due Date': new Date(newEquipmentData['Next Due Date'])
                };
                equipmentData.push(newEquipment);
                
                // Reset form and hide it
                resetNewEquipmentForm();
                toggleNewEquipmentForm();
                
                // Refresh the display
                updateDisplay();
                console.log('✅ Equipment added successfully');
            } else {
                throw new Error(result.error || 'Failed to add equipment');
            }
        } catch (error) {
            console.error('Add equipment error:', error);
            showSuccessMessage(`Failed to add equipment: ${error.message}`);
        }
    } else {
        // Add to local mock data when API is not available
        const newEquipment = {
            ...newEquipmentData,
            'Next Due Date': new Date(newEquipmentData['Next Due Date'])
        };
        
        equipmentData.push(newEquipment);
        
        // Reset form and hide it
        resetNewEquipmentForm();
        toggleNewEquipmentForm();
        
        // Refresh the display
        updateDisplay();
        showSuccessMessage(`Equipment "${newEquipmentData['Type-Description']}" added successfully (offline mode)!`);
        console.log('✅ Equipment added to local data');
    }
}

// Auto-refresh data every 5 minutes
setInterval(() => {
    console.log('🔄 Auto-refreshing calibration data...');
    updateData();
}, 5 * 60 * 1000);

console.log('✅ LEONI Calibration Management System loaded successfully');
