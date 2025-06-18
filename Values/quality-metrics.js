// Quality Metrics Entry JavaScript
// Handles form submissions and local storage for quality metrics with automatic calculations

class QualityMetricsManager {
    constructor() {
        this.storageKey = 'leoni_quality_metrics';
        this.initializeCurrentDate();
        this.loadCurrentValues();
        this.setupEventListeners();
        this.setupCalculationListeners();
        this.loadHistory();
        this.loadDefectData();
    }

    // Initialize current date for all date inputs
    initializeCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('scrapDate').value = today;
        document.getElementById('reworkDate').value = today;
        document.getElementById('defectDate').value = today;
    }

    // Setup calculation listeners for real-time updates
    setupCalculationListeners() {
        // Scrap rate calculation
        const totalScrap = document.getElementById('totalScrap');
        const totalProduction = document.getElementById('totalProduction');
        
        [totalScrap, totalProduction].forEach(input => {
            input.addEventListener('input', () => this.calculateScrapRate());
        });

        // Rework rate calculation
        const totalRework = document.getElementById('totalRework');
        const reworkTotalProduction = document.getElementById('reworkTotalProduction');
        
        [totalRework, reworkTotalProduction].forEach(input => {
            input.addEventListener('input', () => this.calculateReworkRate());
        });

        // Defect PPM calculation
        const totalDefects = document.getElementById('totalDefects');
        const defectTotalProduction = document.getElementById('defectTotalProduction');
        
        [totalDefects, defectTotalProduction].forEach(input => {
            input.addEventListener('input', () => this.calculateDefectPPM());
        });
    }

    // Calculate scrap rate percentage
    calculateScrapRate() {
        const scrap = parseFloat(document.getElementById('totalScrap').value) || 0;
        const production = parseFloat(document.getElementById('totalProduction').value) || 0;
        
        if (production > 0) {
            const rate = (scrap / production) * 100;
            document.getElementById('calculatedScrapRate').textContent = rate.toFixed(2) + '%';
        } else {
            document.getElementById('calculatedScrapRate').textContent = '0.00%';
        }
    }

    // Calculate rework rate percentage
    calculateReworkRate() {
        const rework = parseFloat(document.getElementById('totalRework').value) || 0;
        const production = parseFloat(document.getElementById('reworkTotalProduction').value) || 0;
        
        if (production > 0) {
            const rate = (rework / production) * 100;
            document.getElementById('calculatedReworkRate').textContent = rate.toFixed(2) + '%';
        } else {
            document.getElementById('calculatedReworkRate').textContent = '0.00%';
        }
    }

    // Calculate defect PPM
    calculateDefectPPM() {
        const defects = parseFloat(document.getElementById('totalDefects').value) || 0;
        const production = parseFloat(document.getElementById('defectTotalProduction').value) || 0;
        
        if (production > 0) {
            const ppm = (defects / production) * 1000000;
            document.getElementById('calculatedDefectRate').textContent = Math.round(ppm) + ' PPM';
        } else {
            document.getElementById('calculatedDefectRate').textContent = '0 PPM';
        }
    }

    // Load defect data from existing system (simulated)
    loadDefectData() {
        // Simulate auto-fetching defect count from defect system
        // In real implementation, this would fetch from the Analysis/defects system
        const simulatedDefectCount = Math.floor(Math.random() * 50) + 10; // 10-60 defects
        document.getElementById('totalDefects').value = simulatedDefectCount;
        this.calculateDefectPPM();
    }

    // Setup event listeners for all forms
    setupEventListeners() {
        document.getElementById('scrapForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const scrap = parseFloat(document.getElementById('totalScrap').value);
            const production = parseFloat(document.getElementById('totalProduction').value);
            const rate = production > 0 ? (scrap / production) * 100 : 0;
            
            this.saveMetric('scrap', {
                total_scrap: scrap,
                total_production: production,
                rate: rate,
                productionLine: document.getElementById('scrapProductionLine').value,
                date: document.getElementById('scrapDate').value,
                unit: '%'
            });
        });

        document.getElementById('reworkForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const rework = parseFloat(document.getElementById('totalRework').value);
            const production = parseFloat(document.getElementById('reworkTotalProduction').value);
            const rate = production > 0 ? (rework / production) * 100 : 0;
            
            this.saveMetric('rework', {
                total_rework: rework,
                total_production: production,
                rate: rate,
                productionLine: document.getElementById('reworkProductionLine').value,
                date: document.getElementById('reworkDate').value,
                unit: '%'
            });
        });

        document.getElementById('defectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const defects = parseFloat(document.getElementById('totalDefects').value);
            const production = parseFloat(document.getElementById('defectTotalProduction').value);
            const ppm = production > 0 ? (defects / production) * 1000000 : 0;
            
            this.saveMetric('defect', {
                total_defects: defects,
                total_production: production,
                rate_ppm: Math.round(ppm),
                productionLine: document.getElementById('defectProductionLine').value,
                date: document.getElementById('defectDate').value,
                unit: 'PPM'
            });
        });
    }

    // Save metric to local storage
    saveMetric(metricType, data) {
        try {
            // Get existing data
            const allData = this.getStoredData();
            
            // Create JSONB-compatible quality_data structure
            const qualityData = {
                scrap: {
                    total_scrap: data.total_scrap || 0,
                    total_production: data.total_production || 0,
                    rate: data.rate || 0
                },
                rework: {
                    total_rework: data.total_rework || 0,
                    total_production: data.total_production || 0,
                    rate: data.rate || 0
                },
                defects: {
                    total_defects: data.total_defects || 0,
                    total_production: data.total_production || 0,
                    rate_ppm: data.rate_ppm || 0
                }
            };

            // Create entry with JSONB structure
            const entry = {
                id: Date.now(),
                production_line_id: data.productionLine,
                shift: this.getCurrentShift(),
                date: data.date,
                entered_by: 1, // Default AQL agent ID
                quality_data: qualityData,
                notes: `${metricType} metrics entered via web interface`,
                timestamp: new Date().toISOString(),
                metric_type: metricType // For display purposes
            };

            // Add to data
            allData.push(entry);

            // Sort by date (newest first)
            allData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Keep only last 100 entries
            if (allData.length > 100) {
                allData.splice(100);
            }

            // Save to localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(allData));

            // Update UI
            const displayValue = metricType === 'defect' ? data.rate_ppm : data.rate;
            const displayUnit = metricType === 'defect' ? 'PPM' : '%';
            this.updateCurrentValue(metricType, displayValue, displayUnit);
            this.showMessage(metricType, 'Metric saved successfully!', 'success');
            this.clearForm(metricType);
            this.loadHistory();

            console.log(`${metricType} metric saved with JSONB structure:`, entry);

        } catch (error) {
            console.error('Error saving metric:', error);
            this.showMessage(metricType, 'Error saving metric. Please try again.', 'error');
        }
    }

    // Get current shift based on time
    getCurrentShift() {
        const now = new Date();
        const hour = now.getHours();
        
        if (hour >= 6 && hour < 14) {
            return 'Morning';
        } else if (hour >= 14 && hour < 22) {
            return 'Afternoon';
        } else {
            return 'Night';
        }
    }

    // Get stored data from localStorage
    getStoredData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading stored data:', error);
            return [];
        }
    }

    // Load current values for each metric
    loadCurrentValues() {
        const data = this.getStoredData();

        // Find latest values for each metric type
        const latestValues = {
            scrap: this.getLatestValue(data, 'scrap'),
            rework: this.getLatestValue(data, 'rework'),
            defect: this.getLatestValue(data, 'defect')
        };

        // Update UI with current values
        this.updateCurrentValue('scrap', latestValues.scrap?.value || 0, '%');
        this.updateCurrentValue('rework', latestValues.rework?.value || 0, '%');
        this.updateCurrentValue('defect', latestValues.defect?.value || 0, 'PPM');
    }

    // Get latest value for a specific metric type
    getLatestValue(data, metricType) {
        const filteredData = data.filter(item => item.type === metricType);
        return filteredData.length > 0 ? filteredData[0] : null;
    }

    // Update current value display
    updateCurrentValue(metricType, value, unit) {
        let displayValue;
        switch (metricType) {
            case 'scrap':
                displayValue = `${value.toFixed(2)}%`;
                document.getElementById('currentScrapRate').textContent = displayValue;
                break;
            case 'rework':
                displayValue = `${value.toFixed(2)}%`;
                document.getElementById('currentReworkRate').textContent = displayValue;
                break;
            case 'defect':
                displayValue = `${Math.round(value)} PPM`;
                document.getElementById('currentDefectRate').textContent = displayValue;
                break;
        }
    }

    // Show success/error message
    showMessage(metricType, message, type) {
        const messageElement = document.getElementById(`${metricType}Message`);
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.classList.add('show');

        // Hide message after 3 seconds
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 3000);
    }

    // Clear form after successful submission
    clearForm(metricType) {
        // Clear the input fields based on metric type
        switch (metricType) {
            case 'scrap':
                document.getElementById('totalScrap').value = '';
                document.getElementById('totalProduction').value = '';
                document.getElementById('scrapProductionLine').value = '';
                break;
            case 'rework':
                document.getElementById('totalRework').value = '';
                document.getElementById('reworkTotalProduction').value = '';
                document.getElementById('reworkProductionLine').value = '';
                break;
            case 'defect':
                // Don't clear totalDefects as it's auto-fetched
                document.getElementById('defectTotalProduction').value = '';
                document.getElementById('defectProductionLine').value = '';
                break;
        }
        // Keep the date as current date
    }

    // Load and display history
    loadHistory() {
        const data = this.getStoredData();
        const tbody = document.getElementById('historyTableBody');
        
        // Clear existing content
        tbody.innerHTML = '';

        // Show last 20 entries
        const recentEntries = data.slice(0, 20);

        if (recentEntries.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: #718096; font-style: italic;">
                        No entries yet. Start by adding your first metric value.
                    </td>
                </tr>
            `;
            return;
        }

        recentEntries.forEach(entry => {
            const row = document.createElement('tr');
            
            // Format date
            const date = new Date(entry.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            // Extract values from JSONB structure
            let metricName, displayValue, unit;
            
            if (entry.metric_type === 'scrap') {
                metricName = 'Scrap Rate';
                displayValue = entry.quality_data.scrap.rate.toFixed(2);
                unit = '%';
            } else if (entry.metric_type === 'rework') {
                metricName = 'Rework Rate';
                displayValue = entry.quality_data.rework.rate.toFixed(2);
                unit = '%';
            } else if (entry.metric_type === 'defect') {
                metricName = 'Defect Rate PPM';
                displayValue = Math.round(entry.quality_data.defects.rate_ppm);
                unit = 'PPM';
            } else {
                metricName = 'Unknown';
                displayValue = 'N/A';
                unit = '';
            }

            row.innerHTML = `
                <td>${date}</td>
                <td>${metricName}</td>
                <td>Line ${entry.production_line_id}</td>
                <td style="font-weight: bold; color: #2d3748;">${displayValue}</td>
                <td>${unit}</td>
                <td style="color: #4a5568; font-size: 0.9em;">${entry.shift}</td>
            `;

            tbody.appendChild(row);
        });
    }

    // Format metric type name for display
    formatMetricName(type) {
        const names = {
            'scrap': 'Scrap Rate',
            'rework': 'Rework Rate',
            'defect': 'Defect Rate PPM'
        };
        return names[type] || type;
    }

    // Export data (for future use)
    exportData() {
        const data = this.getStoredData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `leoni_quality_metrics_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Get data for specific production line (for integration with dashboards)
    getDataForLine(productionLine, metricType = null, days = 30) {
        const data = this.getStoredData();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        let filteredData = data.filter(entry => 
            entry.productionLine === productionLine &&
            new Date(entry.date) >= cutoffDate
        );

        if (metricType) {
            filteredData = filteredData.filter(entry => entry.type === metricType);
        }

        return filteredData;
    }

    // Get latest values for all metrics for a specific production line
    getLatestValuesForLine(productionLine) {
        const data = this.getStoredData();
        const lineData = data.filter(entry => entry.productionLine === productionLine);

        return {
            scrapRate: this.getLatestValue(lineData, 'scrap')?.value || 0,
            reworkRate: this.getLatestValue(lineData, 'rework')?.value || 0,
            defectRatePPM: this.getLatestValue(lineData, 'defect')?.value || 0
        };
    }
}

// Initialize the Quality Metrics Manager when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.qualityMetricsManager = new QualityMetricsManager();
    
    // Make functions globally available for potential integration
    window.getQualityMetricsForLine = (line) => {
        return window.qualityMetricsManager.getLatestValuesForLine(line);
    };
    
    window.getQualityMetricsHistory = (line, metric, days) => {
        return window.qualityMetricsManager.getDataForLine(line, metric, days);
    };

    console.log('Quality Metrics Manager initialized');
    console.log('Available production lines: VCE, HDEP-C1, HDEP-C2, HDEP-C3, MDEP, HAULER');
});

// Sample data for testing (will be removed in production)
function loadSampleData() {
    const sampleData = [
        {
            id: 1718700000000,
            type: 'scrap',
            value: 1.2,
            totalScrap: 12,
            totalProduction: 1000,
            productionLine: 'VCE',
            date: '2025-06-15',
            unit: '%',
            timestamp: '2025-06-15T10:30:00.000Z'
        },
        {
            id: 1718700060000,
            type: 'rework',
            value: 0.8,
            totalRework: 8,
            totalProduction: 1000,
            productionLine: 'VCE',
            date: '2025-06-15',
            unit: '%',
            timestamp: '2025-06-15T10:31:00.000Z'
        },
        {
            id: 1718700180000,
            type: 'defect',
            value: 450,
            totalDefects: 45,
            totalProduction: 100000,
            productionLine: 'VCE',
            date: '2025-06-15',
            unit: 'PPM',
            timestamp: '2025-06-15T10:33:00.000Z'
        }
    ];

    localStorage.setItem('leoni_quality_metrics', JSON.stringify(sampleData));
    console.log('Sample data loaded');
    
    // Reload the page to show sample data
    if (window.qualityMetricsManager) {
        window.qualityMetricsManager.loadCurrentValues();
        window.qualityMetricsManager.loadHistory();
    }
}
