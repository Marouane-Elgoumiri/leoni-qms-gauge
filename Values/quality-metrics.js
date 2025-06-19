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
        // Scrap weight display
        const scrapWeight = document.getElementById('scrapWeight');
        
        scrapWeight.addEventListener('input', () => this.updateScrapWeight());

        // Rework status calculation
        const harnessesReworked = document.getElementById('harnessesReworked');
        const totalHarnessesWithDefects = document.getElementById('totalHarnessesWithDefects');
        
        [harnessesReworked, totalHarnessesWithDefects].forEach(input => {
            input.addEventListener('input', () => this.calculateReworkStatus());
        });

        // Defect PPM calculation
        const totalDefects = document.getElementById('totalDefects');
        const defectTotalProduction = document.getElementById('defectTotalProduction');
        
        [totalDefects, defectTotalProduction].forEach(input => {
            input.addEventListener('input', () => this.calculateDefectPPM());
        });
        
        // Production line change listeners for auto-loading defects
        document.getElementById('reworkProductionLine').addEventListener('change', (e) => {
            this.loadDefectDataForLine(e.target.value, 'rework');
        });
        
        document.getElementById('defectProductionLine').addEventListener('change', (e) => {
            this.loadDefectDataForLine(e.target.value, 'defect');
        });
    }

    // Update scrap weight display
    updateScrapWeight() {
        const weight = parseFloat(document.getElementById('scrapWeight').value) || 0;
        document.getElementById('enteredScrapWeight').textContent = weight.toFixed(2) + 'g';
    }

    // Calculate rework status (reworked vs pending)
    calculateReworkStatus() {
        const reworked = parseFloat(document.getElementById('harnessesReworked').value) || 0;
        const total = parseFloat(document.getElementById('totalHarnessesWithDefects').value) || 0;
        
        const pending = Math.max(0, total - reworked);
        
        document.getElementById('calculatedReworkStatus').textContent = `Reworked: ${reworked} | Pending: ${pending}`;
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
        
        // Set defects for defect PPM calculation
        document.getElementById('totalDefects').value = simulatedDefectCount;
        this.calculateDefectPPM();
        
        // Set defects for rework calculation (1 defect = 1 potential rework)
        document.getElementById('numberOfDefects').value = simulatedDefectCount;
        
        // Auto-set total harnesses with defects (assuming 1 harness can have multiple defects)
        const harnessesWithDefects = Math.floor(simulatedDefectCount * 0.7); // ~70% of defects are on different harnesses
        document.getElementById('totalHarnessesWithDefects').value = harnessesWithDefects;
        this.calculateReworkStatus();
    }

    // Load defect data for a specific production line
    loadDefectDataForLine(productionLine, formType) {
        if (!productionLine) return;
        
        // Simulate fetching defects for specific production line
        // In real implementation, this would query the database for defects by production line
        const productionLineDefects = {
            'VCE': Math.floor(Math.random() * 30) + 5,      // 5-35 defects
            'HDEP-C1': Math.floor(Math.random() * 25) + 8,  // 8-33 defects
            'HDEP-C2': Math.floor(Math.random() * 28) + 6,  // 6-34 defects
            'HDEP-C3': Math.floor(Math.random() * 22) + 4,  // 4-26 defects
            'MDEP': Math.floor(Math.random() * 35) + 10,    // 10-45 defects
            'HAULER': Math.floor(Math.random() * 20) + 3    // 3-23 defects
        };
        
        const defectCount = productionLineDefects[productionLine] || Math.floor(Math.random() * 30) + 5;
        
        if (formType === 'rework') {
            document.getElementById('numberOfDefects').value = defectCount;
            const harnessesWithDefects = Math.floor(defectCount * 0.7); // ~70% of defects are on different harnesses
            document.getElementById('totalHarnessesWithDefects').value = harnessesWithDefects;
            this.calculateReworkStatus();
        } else if (formType === 'defect') {
            document.getElementById('totalDefects').value = defectCount;
            this.calculateDefectPPM();
        }
        
        console.log(`Loaded ${defectCount} defects for ${productionLine} line (${formType} form)`);
    }

    // Setup event listeners for all forms
    setupEventListeners() {
        document.getElementById('scrapForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const weight = parseFloat(document.getElementById('scrapWeight').value);
            
            this.saveMetric('scrap', {
                scrap_weight: weight,
                productionLine: document.getElementById('scrapProductionLine').value,
                date: document.getElementById('scrapDate').value,
                unit: 'g'
            });
        });

        document.getElementById('reworkForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const numberOfDefects = parseFloat(document.getElementById('numberOfDefects').value);
            const harnessesReworked = parseFloat(document.getElementById('harnessesReworked').value);
            const totalHarnessesWithDefects = parseFloat(document.getElementById('totalHarnessesWithDefects').value);
            const pendingHarnesses = Math.max(0, totalHarnessesWithDefects - harnessesReworked);
            
            this.saveMetric('rework', {
                number_of_defects: numberOfDefects,
                harnesses_reworked: harnessesReworked,
                total_harnesses_with_defects: totalHarnessesWithDefects,
                pending_harnesses: pendingHarnesses,
                productionLine: document.getElementById('reworkProductionLine').value,
                date: document.getElementById('reworkDate').value,
                unit: 'harnesses'
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
            const qualityData = {};
            
            if (metricType === 'scrap') {
                qualityData.scrap = {
                    scrap_weight: data.scrap_weight || 0,
                    unit: 'g'
                };
            } else if (metricType === 'rework') {
                qualityData.rework = {
                    number_of_defects: data.number_of_defects || 0,
                    harnesses_reworked: data.harnesses_reworked || 0,
                    total_harnesses_with_defects: data.total_harnesses_with_defects || 0,
                    pending_harnesses: data.pending_harnesses || 0
                };
            } else if (metricType === 'defect') {
                qualityData.defects = {
                    total_defects: data.total_defects || 0,
                    total_production: data.total_production || 0,
                    rate_ppm: data.rate_ppm || 0
                };
            }

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
            let displayValue, displayUnit;
            if (metricType === 'scrap') {
                displayValue = data.scrap_weight;
                displayUnit = 'g';
            } else if (metricType === 'rework') {
                displayValue = `${data.harnesses_reworked}/${data.total_harnesses_with_defects}`;
                displayUnit = 'harnesses';
            } else if (metricType === 'defect') {
                displayValue = data.rate_ppm;
                displayUnit = 'PPM';
            } else {
                displayValue = data.rate;
                displayUnit = '%';
            }
            
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
        this.updateCurrentValue('scrap', latestValues.scrap?.value || 0, 'g');
        this.updateCurrentValue('rework', latestValues.rework?.value || '0/0', 'harnesses');
        this.updateCurrentValue('defect', latestValues.defect?.value || 0, 'PPM');
    }

    // Get latest value for a specific metric type
    getLatestValue(data, metricType) {
        const filteredData = data.filter(item => item.metric_type === metricType);
        if (filteredData.length === 0) return { value: 0 };
        
        const latest = filteredData[0];
        let value = 0;
        
        if (metricType === 'scrap' && latest.quality_data?.scrap) {
            value = latest.quality_data.scrap.scrap_weight || 0;
        } else if (metricType === 'rework' && latest.quality_data?.rework) {
            const reworked = latest.quality_data.rework.harnesses_reworked || 0;
            const total = latest.quality_data.rework.total_harnesses_with_defects || 0;
            value = `${reworked}/${total}`;
        } else if (metricType === 'defect' && latest.quality_data?.defects) {
            value = latest.quality_data.defects.rate_ppm || 0;
        }
        
        return { value };
    }

    // Update current value display
    updateCurrentValue(metricType, value, unit) {
        let displayValue;
        switch (metricType) {
            case 'scrap':
                displayValue = `${value.toFixed(2)}g`;
                document.getElementById('currentScrapWeight').textContent = displayValue;
                break;
            case 'rework':
                displayValue = value; // Already formatted as "x/y"
                document.getElementById('currentReworkStatus').textContent = displayValue;
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
                document.getElementById('scrapWeight').value = '';
                document.getElementById('scrapProductionLine').value = '';
                document.getElementById('enteredScrapWeight').textContent = '0.00g';
                break;
            case 'rework':
                document.getElementById('harnessesReworked').value = '';
                document.getElementById('totalHarnessesWithDefects').value = '';
                document.getElementById('reworkProductionLine').value = '';
                document.getElementById('calculatedReworkStatus').textContent = 'Reworked: 0 | Pending: 0';
                // Don't clear numberOfDefects as it's auto-fetched
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
                metricName = 'Scrap Weight';
                displayValue = entry.quality_data.scrap.scrap_weight.toFixed(2);
                unit = 'g';
            } else if (entry.metric_type === 'rework') {
                metricName = 'Rework Status';
                const reworked = entry.quality_data.rework.harnesses_reworked || 0;
                const total = entry.quality_data.rework.total_harnesses_with_defects || 0;
                displayValue = `${reworked}/${total}`;
                unit = 'harnesses';
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
        const lineData = data.filter(entry => entry.production_line_id === productionLine);

        const scrapData = this.getLatestValue(lineData, 'scrap');
        const reworkData = this.getLatestValue(lineData, 'rework');
        const defectData = this.getLatestValue(lineData, 'defect');

        return {
            scrapWeight: typeof scrapData?.value === 'number' ? scrapData.value : 0,
            reworkStatus: typeof reworkData?.value === 'string' ? reworkData.value : '0/0',
            defectRatePPM: typeof defectData?.value === 'number' ? defectData.value : 0
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
