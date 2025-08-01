// Equipment Calibration Management System
// JavaScript functionality for team leader dashboard

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let equipmentData = [];
let alertThreshold = 30;
let lastUpdateTime = null;
let apiAvailable = false;

// Simple test function to force table population
window.forceTablePopulation = async function() {
    console.log('Force table population started...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/equipment`);
        const data = await response.json();
        
        console.log('API response:', data);
        
        if (data.equipment && data.equipment.length > 0) {
            // Update global equipmentData
            equipmentData = data.equipment.map(item => ({
                ...item,
                'Next Due Date': new Date(item['Next Due Date'])
            }));
            
            console.log('equipmentData updated:', equipmentData.length, 'items');
            
            // Force table update
            const tableBody = document.getElementById('equipmentTableBody');
            const tableContainer = document.getElementById('tableContainer');
            const loadingSpinner = document.getElementById('loadingSpinner');
            
            if (tableContainer) tableContainer.style.display = 'block';
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            
            tableBody.innerHTML = '';
            
            // Add first 10 items to table
            equipmentData.slice(0, 10).forEach((equipment, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${equipment['Type-Description'] || 'N/A'}</td>
                    <td>${equipment['Serial no.'] || 'N/A'}</td>
                    <td>${equipment['Manufacturer'] || 'N/A'}</td>
                    <td>${equipment['Location'] || 'N/A'}</td>
                    <td>${equipment['InternalNo'] || 'N/A'}</td>
                    <td>${equipment['Next Due Date'] ? equipment['Next Due Date'].toLocaleDateString() : 'N/A'}</td>
                    <td><span class="status-good">UP TO DATE</span></td>
                    <td>30 days</td>
                    <td>
                        <button class="action-btn edit" onclick="editEquipment(${index})">Edit</button>
                        <button class="action-btn delete" onclick="deleteEquipment(${index})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            console.log('Table populated with', tableBody.children.length, 'rows');
            
            // Also update statistics
            updateStatistics();
            
            console.log('Force table population completed successfully!');
        } else {
            console.error('No equipment data in API response');
        }
    } catch (error) {
        console.error('Force table population failed:', error);
    }
};
window.debugEquipmentData = function() {
    console.log('Debug: equipmentData length:', equipmentData.length);
    console.log('Debug: equipmentData:', equipmentData);
    console.log('Debug: apiAvailable:', apiAvailable);
    console.log('Debug: API_BASE_URL:', API_BASE_URL);
    
    // Test API call
    fetch(`${API_BASE_URL}/equipment`)
        .then(response => response.json())
        .then(data => {
            console.log('Debug: Direct API call result:', data);
            console.log('Debug: Equipment count from API:', data.equipment ? data.equipment.length : 'No equipment array');
        })
        .catch(error => console.error('Debug: API call failed:', error));
};

// Manual reload function for testing
window.manualReload = async function() {
    console.log('Manual reload triggered...');
    console.log('Before reload - equipmentData:', equipmentData.length);
    
    // Force check API connection first
    console.log('Checking API connection first...');
    await checkApiConnection();
    console.log('API available after check:', apiAvailable);
    
    await loadEquipmentData();
    console.log('After reload - equipmentData:', equipmentData.length);
    console.log('Sample equipment data:', equipmentData[0]);
    
    updateDisplay();
    console.log('Display updated manually');
    
    // Additional debug - check if table has content after update
    setTimeout(() => {
        const tableBody = document.getElementById('equipmentTableBody');
        console.log('Table body HTML after update:', tableBody ? tableBody.innerHTML.substring(0, 200) : 'TABLE BODY NOT FOUND');
        console.log('Table body children count:', tableBody ? tableBody.children.length : 'TABLE BODY NOT FOUND');
    }, 100);
};

// Test function to directly populate table
window.testDirectTable = function() {
    console.log('Testing direct table population...');
    const tableBody = document.getElementById('equipmentTableBody');
    
    if (!tableBody) {
        console.error('Table body not found!');
        return;
    }
    
    // Show table container
    const tableContainer = document.getElementById('tableContainer');
    if (tableContainer) {
        tableContainer.style.display = 'block';
    }
    
    // Hide loading spinner
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Check current equipmentData
    console.log('Current equipmentData length:', equipmentData.length);
    
    if (equipmentData.length === 0) {
        console.log('equipmentData is empty, trying direct API call...');
        
        fetch(`${API_BASE_URL}/equipment`)
            .then(response => response.json())
            .then(data => {
                console.log('Direct API call result:', data);
                if (data.equipment && data.equipment.length > 0) {
                    // Clear the table and manually populate from API data
                    tableBody.innerHTML = '';
                    
                    // Process first 5 items for testing
                    data.equipment.slice(0, 5).forEach((equipment, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${equipment['Type-Description'] || 'N/A'}</td>
                            <td>${equipment['Serial no.'] || 'N/A'}</td>
                            <td>${equipment['Manufacturer'] || 'N/A'}</td>
                            <td>${equipment['Location'] || 'N/A'}</td>
                            <td>${equipment['InternalNo'] || 'N/A'}</td>
                            <td>${equipment['Next Due Date'] || 'N/A'}</td>
                            <td><span class="status-good">UP TO DATE</span></td>
                            <td>30 days</td>
                            <td>
                                <button class="action-btn edit">Edit</button>
                                <button class="action-btn delete">Delete</button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                    console.log('Test rows added directly to table from API data');
                    
                    // Also update the global equipmentData
                    equipmentData = data.equipment.map(item => ({
                        ...item,
                        'Next Due Date': new Date(item['Next Due Date'])
                    }));
                    console.log('Global equipmentData updated:', equipmentData.length, 'items');
                }
            })
            .catch(error => console.error('Direct API call failed:', error));
    } else {
        console.log('equipmentData has', equipmentData.length, 'items, adding to table...');
        // Try to add rows using current equipmentData
        equipmentData.slice(0, 3).forEach((equipment, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${equipment['Type-Description'] || 'N/A'}</td>
                <td>${equipment['Serial no.'] || 'N/A'}</td>
                <td>${equipment['Manufacturer'] || 'N/A'}</td>
                <td>${equipment['Location'] || 'N/A'}</td>
                <td>${equipment['InternalNo'] || 'N/A'}</td>
                <td>${equipment['Next Due Date'] || 'N/A'}</td>
                <td><span class="status-good">UP TO DATE</span></td>
                <td>30 days</td>
                <td>
                    <button class="action-btn edit">Edit</button>
                    <button class="action-btn delete">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        console.log('Test rows added from equipmentData');
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 DOM Content Loaded - Starting initialization');
    
    // Step 1: Initialize system settings
    initializeCalibrationSystem();
    
    // Step 2: Check API connection
    console.log('🔍 Checking API connection...');
    await checkApiConnection();
    console.log('✅ API check complete. Available:', apiAvailable);
    
    // Step 3: Load equipment data if API is available
    if (apiAvailable) {
        console.log('📊 Loading equipment data from API...');
        await loadEquipmentData();
        console.log('📊 Equipment data loaded:', equipmentData.length, 'items');
    } else {
        console.log('⚠️ API not available - will wait for file upload');
        equipmentData = [];
    }
    
    // Step 4: Update display
    console.log('🎨 Updating display...');
    updateDisplay();
    console.log('✅ Initialization complete');
    
    // Step 5: Additional debug info
    setTimeout(() => {
        console.log('🔍 Final state check:');
        console.log('  - API Available:', apiAvailable);
        console.log('  - Equipment Data Length:', equipmentData.length);
        console.log('  - Table Body Children:', document.getElementById('equipmentTableBody')?.children.length || 'N/A');
    }, 500);
});

// Check if API is available
async function checkApiConnection() {
    console.log('🔍 Checking API connection...');
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        console.log('📡 API health response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('📡 API health data:', data);
            
            apiAvailable = true;
            console.log('✅ API connection established');
            
            const apiStatus = document.getElementById('apiStatus');
            if (apiStatus) {
                apiStatus.textContent = 'Connected';
                apiStatus.className = 'status-indicator status-connected';
            }
        } else {
            throw new Error('API not responding');
        }
    } catch (error) {
        console.error('⚠️ API connection failed:', error);
        apiAvailable = false;
        console.log('⚠️ API not available - system requires API connection');
        
        const apiStatus = document.getElementById('apiStatus');
        if (apiStatus) {
            apiStatus.textContent = 'Offline - Upload Excel file';
            apiStatus.className = 'status-indicator status-offline';
        }
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

// Load equipment data from API
async function loadEquipmentData() {
    console.log('🔄 Loading equipment data...');
    if (apiAvailable) {
        try {
            console.log('📡 Fetching from API...');
            const response = await fetch(`${API_BASE_URL}/equipment`);
            console.log('📡 API Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📊 Raw API data:', data);
                console.log('📊 Equipment array from API:', data.equipment);
                console.log('📊 Equipment array length:', data.equipment ? data.equipment.length : 'undefined');
                
                if (data.equipment && Array.isArray(data.equipment)) {
                    equipmentData = data.equipment.map(item => ({
                        ...item,
                        'Next Due Date': new Date(item['Next Due Date'])
                    }));
                    lastUpdateTime = new Date();
                    console.log(`📊 Loaded ${equipmentData.length} equipment records from API`);
                    console.log('📊 Sample equipment:', equipmentData[0]);
                    console.log('📊 Global equipmentData variable:', equipmentData);
                } else {
                    console.error('❌ Invalid equipment data structure:', data);
                    equipmentData = [];
                }
                
                // Show the table container and hide loading spinner
                const tableContainer = document.getElementById('tableContainer');
                const loadingSpinner = document.getElementById('loadingSpinner');
                if (tableContainer) {
                    tableContainer.style.display = 'block';
                    console.log('📋 Table container shown');
                }
                if (loadingSpinner) {
                    loadingSpinner.style.display = 'none';
                    console.log('⏳ Loading spinner hidden');
                }
                
                return;
            } else {
                console.error('Failed to load equipment data:', response.status);
                equipmentData = [];
            }
        } catch (error) {
            console.error('Failed to load from API:', error);
            equipmentData = [];
        }
    } else {
        // No API connection - equipmentData will remain empty until file is uploaded
        equipmentData = [];
        console.log('⚠️ No API connection - waiting for file upload');
    }
    
    // Always show table container and hide loading spinner after attempting to load data
    const tableContainer = document.getElementById('tableContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (tableContainer) {
        tableContainer.style.display = 'block';
        console.log('📋 Table container shown');
    }
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
        console.log('⏳ Loading spinner hidden');
    }
}

// Update the display with current data
function updateDisplay() {
    console.log('🔄 Updating display with', equipmentData.length, 'equipment items');
    console.log('🔄 equipmentData sample:', equipmentData[0]);
    
    updateStatistics();
    console.log('📊 Statistics updated');
    
    displayEquipmentTable(); // Use the CRUD version instead of updateEquipmentTable
    console.log('📋 Equipment table displayed');
    
    updateLastUpdated();
    console.log('🕒 Last updated time set');
    
    checkForAlerts();
    console.log('⚠️ Alerts checked');
    
    console.log('✅ Display update completed');
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
        <td><span class="${statusClass}">${statusText}</span></td>
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
        console.log('⚠️ Cannot update data - API not available');
        showErrorMessage('Cannot update data - API connection required. Please check your connection or upload an Excel file.');
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
    
    console.log('📁 File selected:', file.name, file.size, file.type);
    
    if (!file.name.match(/\.(xls|xlsx)$/)) {
        alert('Please select a valid Excel file (.xls or .xlsx)');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
    }
    
    showSuccessMessage(`Uploading file: ${file.name}...`);
    console.log('🚀 Starting file upload...');
    
    if (apiAvailable) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            console.log('📡 Sending to API...');
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData
            });
            
            console.log('📡 Upload response status:', response.status);
            const result = await response.json();
            console.log('📡 Upload result:', result);
            
            if (response.ok) {
                console.log('✅ File uploaded successfully:', result.message);
                showSuccessMessage(`Upload successful: ${result.message}`);
                
                // Reload data and update display immediately
                console.log('🔄 Reloading data after upload...');
                console.log('🔄 equipmentData before reload:', equipmentData.length, 'items');
                await loadEquipmentData();
                console.log('📊 Equipment data after reload:', equipmentData.length, 'items');
                console.log('📊 equipmentData after reload:', equipmentData);
                updateDisplay();
                console.log('✅ Display updated after upload');
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showErrorMessage(`Upload failed: ${error.message}`);
        }
    } else {
        console.log('⚠️ Cannot upload file - API not available');
        showErrorMessage(`Cannot upload file "${file.name}" - API connection required. Please check your connection and try again.`);
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

// Show error message to user
function showErrorMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    if (errorMessage && errorText) {
        errorText.textContent = message;
        errorMessage.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    } else {
        // Fallback to alert if error message elements don't exist
        alert('Error: ' + message);
    }
}

// ========================================
// CRUD Operations for Equipment Management
// ========================================

// Display equipment data in the table with CRUD controls
function displayEquipmentTable() {
    console.log('📋 Displaying equipment table...');
    const tableBody = document.getElementById('equipmentTableBody');
    const tableContainer = document.getElementById('tableContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    console.log('📋 Table elements found:', {
        tableBody: !!tableBody,
        tableContainer: !!tableContainer,
        loadingSpinner: !!loadingSpinner,
        equipmentDataLength: equipmentData.length
    });
    
    if (!tableBody) {
        console.error('❌ Table body not found!');
        return;
    }
    
    // Show table container and hide loading spinner
    if (tableContainer) {
        tableContainer.style.display = 'block';
        console.log('📋 Table container shown');
    }
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
        console.log('⏳ Loading spinner hidden');
    }
    
    tableBody.innerHTML = '';
    
    if (equipmentData.length === 0) {
        console.log('📋 No equipment data, showing empty message');
        const apiStatusText = apiAvailable ? 
            'Upload your laboratory_measures.xls/.xlsx file above or add equipment manually using the form.' :
            'API connection not available. Please upload your laboratory_measures.xls/.xlsx file to load equipment data.';
        
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; color: #64748b; padding: 40px;">
                    <i class="fas fa-upload" style="font-size: 2rem; margin-bottom: 10px; display: block; color: var(--leoni-primary);"></i>
                    <strong style="display: block; margin-bottom: 10px; color: #1a202c;">No Equipment Data Loaded</strong>
                    ${apiStatusText}
                </td>
            </tr>
        `;
        
        // Update row count display
        const rowCountElement = document.getElementById('tableRowCount');
        if (rowCountElement) {
            rowCountElement.textContent = '0';
        }
        
        return;
    }
    
    console.log('📋 Creating table rows for', equipmentData.length, 'equipment items');
    equipmentData.forEach((equipment, index) => {
        const row = createEquipmentRow(equipment, index);
        tableBody.appendChild(row);
    });
    
    // Update row count display
    const rowCountElement = document.getElementById('tableRowCount');
    if (rowCountElement) {
        rowCountElement.textContent = equipmentData.length;
    }
    
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
        <td><span class="${statusClass}">${statusText}</span></td>
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
// Utility Functions
// ========================================

// Format date for display
function formatDate(dateObj) {
    if (!dateObj) return 'N/A';
    
    const date = new Date(dateObj);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format date for input field (YYYY-MM-DD)
function formatDateForInput(dateObj) {
    if (!dateObj) return '';
    
    const date = new Date(dateObj);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show message to user
function showMessage(message, type) {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    if (type === 'success') {
        showSuccessMessage(message);
    } else if (type === 'error') {
        alert(`Error: ${message}`);
    } else {
        alert(message);
    }
}

// ========================================
// Table Navigation and Scrolling Features
// ========================================

// Setup table keyboard navigation and scrolling features
function setupTableFeatures() {
    const tableContainer = document.getElementById('tableContainer');
    
    if (!tableContainer) return;
    
    // Add keyboard navigation for table
    tableContainer.addEventListener('keydown', function(e) {
        const focusedElement = document.activeElement;
        
        // Allow arrow key navigation between action buttons
        if (focusedElement && focusedElement.classList.contains('action-btn')) {
            const allButtons = Array.from(tableContainer.querySelectorAll('.action-btn'));
            const currentIndex = allButtons.indexOf(focusedElement);
            
            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % allButtons.length;
                    allButtons[nextIndex].focus();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : allButtons.length - 1;
                    allButtons[prevIndex].focus();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    // Find next row's first button
                    const currentRow = focusedElement.closest('tr');
                    const nextRow = currentRow.nextElementSibling;
                    if (nextRow) {
                        const nextRowFirstButton = nextRow.querySelector('.action-btn');
                        if (nextRowFirstButton) nextRowFirstButton.focus();
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    // Find previous row's first button
                    const currentRowUp = focusedElement.closest('tr');
                    const prevRow = currentRowUp.previousElementSibling;
                    if (prevRow) {
                        const prevRowFirstButton = prevRow.querySelector('.action-btn');
                        if (prevRowFirstButton) prevRowFirstButton.focus();
                    }
                    break;
            }
        }
    });
    
    // Add smooth scrolling to top/bottom functions
    window.scrollToTableTop = function() {
        tableContainer.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    window.scrollToTableBottom = function() {
        tableContainer.scrollTo({ top: tableContainer.scrollHeight, behavior: 'smooth' });
    };
    
    // Add scroll position indicator
    let scrollTimeout;
    tableContainer.addEventListener('scroll', function() {
        const scrollIndicator = tableContainer.querySelector('.table-scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
            
            // Update scroll indicator text based on position
            const scrollPercentage = Math.round((this.scrollTop / (this.scrollHeight - this.clientHeight)) * 100);
            if (scrollPercentage === 0) {
                scrollIndicator.innerHTML = '<i class="fas fa-arrow-down"></i> Scroll down for more';
            } else if (scrollPercentage === 100 || scrollPercentage >= 99) {
                scrollIndicator.innerHTML = '<i class="fas fa-arrow-up"></i> Scroll up to top';
            } else {
                scrollIndicator.innerHTML = `<i class="fas fa-arrows-alt-v"></i> ${scrollPercentage}% scrolled`;
            }
            
            // Hide indicator after scroll stops
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                scrollIndicator.style.opacity = '0';
            }, 2000);
        }
    });
}

// Call setup function when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupTableFeatures, 100); // Small delay to ensure table is rendered
});

console.log('✅ LEONI Calibration Management System loaded successfully');
