// Technician Quality Metrics Manager - LEONI Quality System
// Handles RFT, CPK, and FPY metrics entry by Quality Technicians

class TechnicianMetricsManager {
    constructor() {
        this.storageKey = 'leoni_technician_metrics';
        this.initializeCurrentDate();
        this.loadCurrentValues();
        this.setupEventListeners();
        this.setupCalculationListeners();
        this.loadHistory();
    }

    // Initialize current date for all date inputs
    initializeCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('rftDate').value = today;
        document.getElementById('cpkDate').value = today;
        document.getElementById('fpyDate').value = today;
    }

    // Setup calculation listeners for real-time updates
    setupCalculationListeners() {
        // RFT calculation
        const rftDefectFreeUnits = document.getElementById('rftDefectFreeUnits');
        const rftTotalUnitsProduced = document.getElementById('rftTotalUnitsProduced');
        
        [rftDefectFreeUnits, rftTotalUnitsProduced].forEach(input => {
            input.addEventListener('input', () => this.calculateRFT());
        });

        // CPK calculation
        const cpkInputs = [
            'cpkUpperLimit', 'cpkLowerLimit', 
            'cpkProcessMean', 'cpkStandardDeviation'
        ];
        
        cpkInputs.forEach(inputId => {
            document.getElementById(inputId).addEventListener('input', () => this.calculateCPK());
        });

        // FPY calculation
        const fpyGoodUnits = document.getElementById('fpyGoodUnits');
        const fpyTotalUnits = document.getElementById('fpyTotalUnits');
        
        [fpyGoodUnits, fpyTotalUnits].forEach(input => {
            input.addEventListener('input', () => this.calculateFPY());
        });
    }

    // Calculate Right First Time (RFT) percentage
    // RFT = (Number of Defect-Free Units / Total Number of Units Produced) × 100
    calculateRFT() {
        const defectFreeUnits = parseFloat(document.getElementById('rftDefectFreeUnits').value) || 0;
        const totalUnitsProduced = parseFloat(document.getElementById('rftTotalUnitsProduced').value) || 0;
        
        if (totalUnitsProduced > 0) {
            const rft = (defectFreeUnits / totalUnitsProduced) * 100;
            document.getElementById('calculatedRFT').textContent = rft.toFixed(2) + '%';
        } else {
            document.getElementById('calculatedRFT').textContent = '0.00%';
        }
    }

    // Calculate Process Capability (CPK)
    calculateCPK() {
        const usl = parseFloat(document.getElementById('cpkUpperLimit').value) || 0;
        const lsl = parseFloat(document.getElementById('cpkLowerLimit').value) || 0;
        const mean = parseFloat(document.getElementById('cpkProcessMean').value) || 0;
        const stdDev = parseFloat(document.getElementById('cpkStandardDeviation').value) || 0;
        
        if (stdDev > 0 && usl > lsl) {
            // CPK = min(CPU, CPL)
            // CPU = (USL - μ) / (3σ)
            // CPL = (μ - LSL) / (3σ)
            const cpu = (usl - mean) / (3 * stdDev);
            const cpl = (mean - lsl) / (3 * stdDev);
            const cpk = Math.min(cpu, cpl);
            
            document.getElementById('calculatedCPK').textContent = cpk.toFixed(3);
        } else {
            document.getElementById('calculatedCPK').textContent = '0.000';
        }
    }

    // Calculate First Pass Yield (FPY) percentage
    calculateFPY() {
        const goodUnits = parseFloat(document.getElementById('fpyGoodUnits').value) || 0;
        const totalUnits = parseFloat(document.getElementById('fpyTotalUnits').value) || 0;
        
        if (totalUnits > 0) {
            const fpy = (goodUnits / totalUnits) * 100;
            document.getElementById('calculatedFPY').textContent = fpy.toFixed(2) + '%';
        } else {
            document.getElementById('calculatedFPY').textContent = '0.00%';
        }
    }

    // Setup event listeners for all forms
    setupEventListeners() {
        // RFT Form
        document.getElementById('rftForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const defectFreeUnits = parseFloat(document.getElementById('rftDefectFreeUnits').value);
            const totalUnitsProduced = parseFloat(document.getElementById('rftTotalUnitsProduced').value);
            const rft = totalUnitsProduced > 0 ? (defectFreeUnits / totalUnitsProduced) * 100 : 0;
            
            this.saveMetric('rft', {
                defect_free_units: defectFreeUnits,
                total_units_produced: totalUnitsProduced,
                rft_percentage: rft,
                production_line_id: document.getElementById('rftProductionLine').value,
                date: document.getElementById('rftDate').value,
                unit: '%'
            });
        });

        // CPK Form
        document.getElementById('cpkForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const usl = parseFloat(document.getElementById('cpkUpperLimit').value);
            const lsl = parseFloat(document.getElementById('cpkLowerLimit').value);
            const mean = parseFloat(document.getElementById('cpkProcessMean').value);
            const stdDev = parseFloat(document.getElementById('cpkStandardDeviation').value);
            
            // Calculate CPK
            const cpu = (usl - mean) / (3 * stdDev);
            const cpl = (mean - lsl) / (3 * stdDev);
            const cpk = Math.min(cpu, cpl);
            
            this.saveMetric('cpk', {
                upper_spec_limit: usl,
                lower_spec_limit: lsl,
                process_mean: mean,
                standard_deviation: stdDev,
                cpk_value: cpk,
                production_line_id: document.getElementById('cpkProductionLine').value,
                date: document.getElementById('cpkDate').value,
                unit: ''
            });
        });

        // FPY Form
        document.getElementById('fpyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const goodUnits = parseFloat(document.getElementById('fpyGoodUnits').value);
            const totalUnits = parseFloat(document.getElementById('fpyTotalUnits').value);
            const fpy = totalUnits > 0 ? (goodUnits / totalUnits) * 100 : 0;
            
            this.saveMetric('fpy', {
                good_units: goodUnits,
                total_units: totalUnits,
                fpy_percentage: fpy,
                production_line_id: document.getElementById('fpyProductionLine').value,
                date: document.getElementById('fpyDate').value,
                unit: '%'
            });
        });
    }

    // Save metric to local storage
    saveMetric(metricType, data) {
        try {
            // Validate the data first
            const validationErrors = this.validateMetricData(metricType, data);
            if (validationErrors.length > 0) {
                this.showValidationErrors(validationErrors, metricType);
                return false;
            }
            
            // Clear any previous errors
            this.showValidationErrors([], metricType);
            
            const currentTime = new Date();
            const shift = this.determineShift(currentTime);
            
            const entry = {
                id: Date.now(),
                metric_type: metricType,
                production_line_id: data.production_line_id,
                date: data.date,
                shift: shift,
                timestamp: currentTime.toISOString(),
                technician_data: {}
            };

            // Structure data based on metric type
            if (metricType === 'rft') {
                entry.technician_data.rft = {
                    defect_free_units: data.defect_free_units,
                    total_units_produced: data.total_units_produced,
                    rft_percentage: data.rft_percentage
                };
                entry.value = data.rft_percentage;
            } else if (metricType === 'cpk') {
                entry.technician_data.cpk = {
                    upper_spec_limit: data.upper_spec_limit,
                    lower_spec_limit: data.lower_spec_limit,
                    process_mean: data.process_mean,
                    standard_deviation: data.standard_deviation,
                    cpk_value: data.cpk_value
                };
                entry.value = data.cpk_value;
            } else if (metricType === 'fpy') {
                entry.technician_data.fpy = {
                    good_units: data.good_units,
                    total_units: data.total_units,
                    fpy_percentage: data.fpy_percentage
                };
                entry.value = data.fpy_percentage;
            }

            // Check for duplicates
            if (this.checkForDuplicates(metricType, data.production_line_id, data.date, shift)) {
                this.showMessage(metricType, 'Duplicate entry detected for this shift. Metric not saved.', 'error');
                return;
            }

            // Get existing data
            const existingData = this.getStoredData();
            existingData.unshift(entry);

            // Keep only last 100 entries
            if (existingData.length > 100) {
                existingData.splice(100);
            }

            // Save to localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(existingData));

            // Update UI
            let displayValue, displayUnit;
            if (metricType === 'rft') {
                displayValue = data.rft_percentage;
                displayUnit = '%';
            } else if (metricType === 'cpk') {
                displayValue = data.cpk_value;
                displayUnit = '';
            } else if (metricType === 'fpy') {
                displayValue = data.fpy_percentage;
                displayUnit = '%';
            }
            
            this.updateCurrentValue(metricType, displayValue, displayUnit);
            this.showMessage(metricType, `${this.formatMetricName(metricType)} saved successfully!`, 'success');
            this.clearForm(metricType);
            this.loadHistory();

        } catch (error) {
            console.error('Error saving metric:', error);
            this.showMessage(metricType, 'Error saving metric. Please try again.', 'error');
        }
    }

    // Check for duplicate entries on same day/shift
    checkForDuplicates(metricType, productionLine, date, shift) {
        const data = this.getStoredData();
        return data.some(entry => 
            entry.metric_type === metricType &&
            entry.production_line_id === productionLine &&
            entry.date === date &&
            entry.shift === shift
        );
    }

    // Calculate trend for a metric
    calculateTrend(metricType, productionLine, currentValue) {
        const data = this.getStoredData();
        const historicalData = data
            .filter(entry => 
                entry.metric_type === metricType && 
                entry.production_line_id === productionLine
            )
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5); // Last 5 entries

        if (historicalData.length < 2) return 'stable';

        const previousValue = historicalData[1].value;
        const diff = currentValue - previousValue;
        const threshold = currentValue * 0.05; // 5% threshold

        if (Math.abs(diff) < threshold) return 'stable';
        return diff > 0 ? 'up' : 'down';
    }

    // Get metric statistics for a production line
    getMetricStats(metricType, productionLine, days = 30) {
        const data = this.getStoredData();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const relevantData = data.filter(entry => 
            entry.metric_type === metricType &&
            entry.production_line_id === productionLine &&
            new Date(entry.timestamp) >= cutoffDate
        );

        if (relevantData.length === 0) {
            return { count: 0, average: 0, min: 0, max: 0, trend: 'stable' };
        }

        const values = relevantData.map(entry => entry.value);
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);

        return {
            count: relevantData.length,
            average: average,
            min: min,
            max: max,
            trend: this.calculateTrend(metricType, productionLine, values[0])
        };
    }

    // Validate input data for different metric types
    validateMetricData(metricType, data) {
        const errors = [];
        
        switch (metricType) {
            case 'rft':
                if (!data.defect_free_units || data.defect_free_units < 0) {
                    errors.push('Defect-free units must be a positive number');
                }
                if (!data.total_units_produced || data.total_units_produced <= 0) {
                    errors.push('Total units produced must be greater than 0');
                }
                if (data.defect_free_units > data.total_units_produced) {
                    errors.push('Defect-free units cannot exceed total units produced');
                }
                break;
                
            case 'cpk':
                if (!data.upper_spec_limit || !data.lower_spec_limit) {
                    errors.push('Both upper and lower specification limits are required');
                }
                if (data.upper_spec_limit <= data.lower_spec_limit) {
                    errors.push('Upper specification limit must be greater than lower limit');
                }
                if (!data.standard_deviation || data.standard_deviation <= 0) {
                    errors.push('Standard deviation must be greater than 0');
                }
                if (data.process_mean < data.lower_spec_limit || data.process_mean > data.upper_spec_limit) {
                    errors.push('Process mean should be within specification limits');
                }
                break;
                
            case 'fpy':
                if (!data.good_units || data.good_units < 0) {
                    errors.push('Good units must be a positive number');
                }
                if (!data.total_units || data.total_units <= 0) {
                    errors.push('Total units must be greater than 0');
                }
                if (data.good_units > data.total_units) {
                    errors.push('Good units cannot exceed total units');
                }
                break;
        }
        
        // Common validations
        if (!data.production_line_id) {
            errors.push('Production line must be selected');
        }
        if (!data.date) {
            errors.push('Date is required');
        }
        
        return errors;
    }

    // Show validation errors to user
    showValidationErrors(errors, metricType) {
        const errorContainer = document.getElementById(`${metricType}Errors`);
        if (errorContainer) {
            if (errors.length > 0) {
                errorContainer.innerHTML = `
                    <div class="error-message">
                        <strong>Please fix the following errors:</strong>
                        <ul>
                            ${errors.map(error => `<li>${error}</li>`).join('')}
                        </ul>
                    </div>
                `;
                errorContainer.style.display = 'block';
            } else {
                errorContainer.style.display = 'none';
            }
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

    // Determine work shift based on time
    determineShift(date) {
        const hour = date.getHours();
        if (hour >= 6 && hour < 14) return 'Morning';
        if (hour >= 14 && hour < 22) return 'Afternoon';
        return 'Night';
    }

    // Update current value display
    updateCurrentValue(metricType, value, unit) {
        let displayValue;
        switch (metricType) {
            case 'rft':
                displayValue = `${value.toFixed(2)}%`;
                document.getElementById('currentRFT').textContent = displayValue;
                break;
            case 'cpk':
                displayValue = value.toFixed(3);
                document.getElementById('currentCPK').textContent = displayValue;
                break;
            case 'fpy':
                displayValue = `${value.toFixed(2)}%`;
                document.getElementById('currentFPY').textContent = displayValue;
                break;
        }
    }

    // Clear form after successful submission
    clearForm(metricType) {
        switch (metricType) {
            case 'rft':
                document.getElementById('rftDefectFreeUnits').value = '';
                document.getElementById('rftTotalUnitsProduced').value = '';
                document.getElementById('rftProductionLine').value = '';
                document.getElementById('calculatedRFT').textContent = '0.00%';
                break;
            case 'cpk':
                document.getElementById('cpkUpperLimit').value = '';
                document.getElementById('cpkLowerLimit').value = '';
                document.getElementById('cpkProcessMean').value = '';
                document.getElementById('cpkStandardDeviation').value = '';
                document.getElementById('cpkProductionLine').value = '';
                document.getElementById('calculatedCPK').textContent = '0.000';
                break;
            case 'fpy':
                document.getElementById('fpyGoodUnits').value = '';
                document.getElementById('fpyTotalUnits').value = '';
                document.getElementById('fpyProductionLine').value = '';
                document.getElementById('calculatedFPY').textContent = '0.00%';
                break;
        }
    }

    // Show success/error messages
    showMessage(metricType, message, type) {
        const messageElement = document.getElementById(`${metricType}Message`);
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';

        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }

    // Get latest value for a specific metric type
    getLatestValue(data, metricType) {
        const filtered = data.filter(entry => entry.metric_type === metricType);
        return filtered.length > 0 ? filtered[0] : null;
    }

    // Load current values for each metric
    loadCurrentValues() {
        const data = this.getStoredData();

        // Find latest values for each metric type
        const latestValues = {
            rft: this.getLatestValue(data, 'rft'),
            cpk: this.getLatestValue(data, 'cpk'),
            fpy: this.getLatestValue(data, 'fpy')
        };

        // Update UI with current values
        this.updateCurrentValue('rft', latestValues.rft?.value || 0, '%');
        this.updateCurrentValue('cpk', latestValues.cpk?.value || 0, '');
        this.updateCurrentValue('fpy', latestValues.fpy?.value || 0, '%');
    }

    // Load and display history
    loadHistory() {
        const data = this.getStoredData();
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = '';

        // Show last 20 entries
        const recentEntries = data.slice(0, 20);

        recentEntries.forEach(entry => {
            const row = document.createElement('tr');
            const date = new Date(entry.date).toLocaleDateString();
            
            let metricName, displayValue, unit;
            
            if (entry.metric_type === 'rft') {
                metricName = 'Right First Time';
                displayValue = entry.technician_data.rft.rft_percentage.toFixed(2);
                unit = '%';
            } else if (entry.metric_type === 'cpk') {
                metricName = 'Process Capability';
                displayValue = entry.technician_data.cpk.cpk_value.toFixed(3);
                unit = '';
            } else if (entry.metric_type === 'fpy') {
                metricName = 'First Pass Yield';
                displayValue = entry.technician_data.fpy.fpy_percentage.toFixed(2);
                unit = '%';
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
            'rft': 'Right First Time',
            'cpk': 'Process Capability',
            'fpy': 'First Pass Yield'
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
        link.download = `leoni_technician_metrics_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Get latest values for all metrics for a specific production line
    getLatestValuesForLine(productionLine) {
        const data = this.getStoredData();
        const lineData = data.filter(entry => entry.production_line_id === productionLine);

        const rftData = this.getLatestValue(lineData, 'rft');
        const cpkData = this.getLatestValue(lineData, 'cpk');
        const fpyData = this.getLatestValue(lineData, 'fpy');

        return {
            rft: typeof rftData?.value === 'number' ? rftData.value : 0,
            cpk: typeof cpkData?.value === 'number' ? cpkData.value : 0,
            fpy: typeof fpyData?.value === 'number' ? fpyData.value : 0
        };
    }

    // Get historical data for trend analysis
    getHistoricalData(productionLine, metricType, days = 7) {
        const data = this.getStoredData();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return data.filter(entry => 
            entry.production_line_id === productionLine && 
            entry.metric_type === metricType &&
            new Date(entry.date) >= cutoffDate
        ).sort((a, b) => new Date(a.date) - new Date(b.date));
    }
}

// Global functions for dashboard integration
function getTechnicianMetricsForLine(productionLine) {
    if (window.technicianMetricsManager) {
        return window.technicianMetricsManager.getLatestValuesForLine(productionLine);
    }
    return { rft: 0, cpk: 0, fpy: 0 };
}

function getTechnicianMetricsHistory(productionLine, metricType, days = 7) {
    if (window.technicianMetricsManager) {
        return window.technicianMetricsManager.getHistoricalData(productionLine, metricType, days);
    }
    return [];
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.technicianMetricsManager = new TechnicianMetricsManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TechnicianMetricsManager;
}
