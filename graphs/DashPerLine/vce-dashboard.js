// VCE Production Line Dashboard - LEONI Quality System
class VCEDashboard {
    constructor() {
        this.defectsChart = null;
        this.currentPeriod = 'today';
        this.autoRefreshInterval = null;
        this.qualityMetricsIntegrated = false;
        this.init();
    }

    init() {
        this.loadInitialData();
        this.setupCharts();
        this.setupEventListeners();
        this.startAutoRefresh();
        this.updateLastUpdateTime();
        this.integrateQualityMetrics();
    }

    // Integrate manually entered quality metrics
    integrateQualityMetrics() {
        try {
            // Check if quality metrics functions are available
            if (typeof getQualityMetricsForLine === 'function') {
                const manualMetrics = getQualityMetricsForLine('VCE');
                
                // Override mock data with manual entries if available
                if (manualMetrics.scrapWeight > 0) {
                    vceData.qualityKPIs.scrapWeight.value = manualMetrics.scrapWeight.toFixed(1);
                    vceData.qualityKPIs.scrapWeight.trend = this.calculateTrend('scrap', manualMetrics.scrapWeight);
                }
                
                if (manualMetrics.reworkStatus && manualMetrics.reworkStatus.includes('/')) {
                    const [reworked, total] = manualMetrics.reworkStatus.split('/').map(n => parseInt(n));
                    vceData.qualityKPIs.reworkStatus.reworked = reworked;
                    vceData.qualityKPIs.reworkStatus.total = total;
                    vceData.qualityKPIs.reworkStatus.trend = this.calculateTrend('rework', reworked);
                }
                
                if (manualMetrics.defectRatePPM > 0) {
                    vceData.qualityKPIs.defectRate.value = manualMetrics.defectRatePPM;
                    vceData.qualityKPIs.defectRate.trend = this.calculateTrend('defect', manualMetrics.defectRatePPM);
                }
                
                this.qualityMetricsIntegrated = true;
                console.log('Quality metrics integrated successfully:', manualMetrics);
            } else {
                console.warn('Quality metrics functions not available - using mock data');
            }

            // Check if technician metrics functions are available
            if (typeof getTechnicianMetricsForLine === 'function') {
                const technicianMetrics = getTechnicianMetricsForLine('VCE');
                
                // Override mock data with technician entries if available
                if (technicianMetrics.fpy > 0) {
                    vceData.qualityKPIs.firstPassYield.value = technicianMetrics.fpy.toFixed(1);
                    vceData.qualityKPIs.firstPassYield.trend = this.calculateTrend('fpy', technicianMetrics.fpy);
                }
                
                if (technicianMetrics.cpk > 0) {
                    vceData.qualityKPIs.processCapability.value = technicianMetrics.cpk.toFixed(2);
                    vceData.qualityKPIs.processCapability.trend = this.calculateTrend('cpk', technicianMetrics.cpk);
                }
                
                console.log('Technician metrics integrated successfully:', technicianMetrics);
            } else {
                console.warn('Technician metrics functions not available - using mock data');
            }
        } catch (error) {
            console.warn('Error integrating quality metrics:', error);
        }
    }

    // Calculate trend based on historical data
    calculateTrend(metricType, currentValue) {
        try {
            if (typeof getQualityMetricsHistory === 'function') {
                const history = getQualityMetricsHistory('VCE', metricType, 7); // Last 7 days
                if (history.length >= 2) {
                    const previousValue = history[history.length - 2].value;
                    const change = currentValue - previousValue;
                    
                    // For scrap rate, rework rate, defect rate, and complaints - lower is better
                    if (['scrap', 'rework', 'defect', 'complaints'].includes(metricType)) {
                        return change < 0 ? 'down' : change > 0 ? 'up' : 'stable';
                    }
                }
            }
        } catch (error) {
            console.warn('Error calculating trend:', error);
        }
        return 'stable';
    }

    // Load and display initial KPI data
    loadInitialData() {
        this.updateKPICards();
        this.updateDefectsTable();
        this.updateLastUpdateTime();
    }

    // Update all KPI cards with current data and status
    updateKPICards() {
        const kpis = vceData.qualityKPIs;

        Object.keys(kpis).forEach(kpiName => {
            const kpiData = kpis[kpiName];
            const value = kpiData.value;
            const status = vceData.getKPIStatus(kpiName, parseFloat(value));

            const card = document.getElementById(`${kpiName}Card`) || 
                        document.getElementById(`${this.getCardId(kpiName)}Card`);
            if (card) {
                card.className = `kpi-card ${status}`;
            }

            const valueElement = document.getElementById(this.getElementId(kpiName));
            if (valueElement) {
                if (kpiName === 'processCapability') {
                    valueElement.textContent = value;
                } else if (kpiName === 'defectRate') {
                    valueElement.textContent = `${value} PPM`;
                } else if (kpiName === 'customerComplaints') {
                    const complaints = vceData.qualityKPIs.customerComplaints;
                    if (complaints && typeof complaints === 'object' && 'j1' in complaints && 'year' in complaints) {
                        valueElement.textContent = `${complaints.j1} / ${complaints.year}`;
                    } else {
                        valueElement.textContent = `${value}`;
                    }
                } else if (kpiName === 'defectCount') {
                    valueElement.textContent = `${value}`;
                } else if (kpiName === 'scrapWeight') {
                    valueElement.textContent = `${value}g`;
                } else if (kpiName === 'rftRate') {
                    valueElement.textContent = `${value}%`;
                } else if (kpiName === 'reworkRate') {
                    valueElement.textContent = `${value}%`;
                } else if (kpiName === 'reworkStatus') {
                    const reworkData = vceData.qualityKPIs.reworkStatus;
                    valueElement.textContent = `${reworkData.reworked}/${reworkData.total}`;
                } else {
                    valueElement.textContent = `${value}%`;
                }
            }

            this.updateTrendIndicator(kpiName, kpiData.trend, kpiData.trendValue);
        });
    }

    // Helper method to get element ID
    getElementId(kpiName) {
        const mapping = {
            defectRate: 'defectRate',
            firstPassYield: 'firstPassYield',
            defectCount: 'totalDefectCount',
            reworkStatus: 'reworkStatus',
            processCapability: 'processCapability',
            customerComplaints: 'customerComplaints',
            audit5S: 'audit5S',
            auditAFP: 'auditAFP',
            lineEfficiency: 'lineEfficiency',
            scrapWeight: 'scrapWeight'
        };
        return mapping[kpiName] || kpiName;
    }

    // Helper method to get card ID
    getCardId(kpiName) {
        const mapping = {
            defectRate: 'defectRate',
            firstPassYield: 'fpy',
            defectCount: 'defectCount',
            reworkStatus: 'rework',
            processCapability: 'cpk',
            customerComplaints: 'customer',
            audit5S: 'audit5s',
            auditAFP: 'auditAfp',
            lineEfficiency: 'lineEfficiency',
            scrapWeight: 'scrap'
        };
        return mapping[kpiName] || kpiName;
    }

    // Update trend indicators
    updateTrendIndicator(kpiName, trend, value) {
        const trendElement = document.getElementById(`${kpiName}Trend`) || 
                           document.getElementById(`${this.getCardId(kpiName)}Trend`);
        if (!trendElement) return;

        const icon = trendElement.querySelector('i');
        const span = trendElement.querySelector('span');
        
        // Remove existing trend classes
        trendElement.classList.remove('trend-up', 'trend-down', 'trend-stable');
        
        // Add appropriate trend class and update content
        switch(trend) {
            case 'up':
                trendElement.classList.add('trend-up');
                icon.className = 'fas fa-arrow-up';
                span.textContent = `+${Math.abs(value)}${this.getTrendUnit(kpiName)}`;
                break;
            case 'down':
                trendElement.classList.add('trend-down');
                icon.className = 'fas fa-arrow-down';
                span.textContent = `-${Math.abs(value)}${this.getTrendUnit(kpiName)}`;
                break;
            case 'stable':
                trendElement.classList.add('trend-stable');
                icon.className = 'fas fa-minus';
                span.textContent = `${value}${this.getTrendUnit(kpiName)}`;
                break;
        }
    }

    // Get appropriate unit for trend display
    getTrendUnit(kpiName) {
        if (kpiName === 'processCapability') return '';
        if (kpiName === 'defectRate' || kpiName === 'customerComplaints') return ' PPM';
        if (kpiName === 'defectCount') return '';
        return '%';
    }

    // Update defects table
    updateDefectsTable() {
        const tbody = document.getElementById('defectsTableBody');
        tbody.innerHTML = '';
        
        vceData.topDefects.forEach(defect => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${defect.name}</td>
                <td>${defect.count}</td>
                <td><span class="severity-badge severity-${defect.severity}">${defect.severity.toUpperCase()}</span></td>
                <td>${defect.ppm}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Setup charts
    setupCharts() {
        this.createDefectsChart();
    }

    // Create defects analysis chart
    createDefectsChart() {
        const ctx = document.getElementById('defectsChart').getContext('2d');
        
        const labels = vceData.topDefects.map(defect => defect.name);
        const data = vceData.topDefects.map(defect => defect.count);
        const colors = vceData.colorSchemes.defects;

        this.defectsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Defects',
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors.map(color => color + 'CC'),
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            color: '#64748b'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            maxRotation: 45
                        }
                    }
                }
            }
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Chart period controls
        document.querySelectorAll('[data-period]').forEach(button => {
            button.addEventListener('click', (e) => {
                const period = e.target.dataset.period;
                this.changePeriod(period);
            });
        });
    }

    // Change chart period
    changePeriod(period) {
        this.currentPeriod = period;
        
        // Update button states
        document.querySelectorAll('[data-period]').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`).classList.add('active');
        
        // Update defects chart (simulate different period data)
        this.updateDefectsChart();
    }

    // Update defects chart for different periods
    updateDefectsChart() {
        // Simulate different data for different periods
        let multiplier = 1;
        switch(this.currentPeriod) {
            case 'today':
                multiplier = 1;
                break;
            case 'week':
                multiplier = 7;
                break;
            case 'month':
                multiplier = 30;
                break;
        }
        
        const newData = vceData.topDefects.map(defect => defect.count * multiplier);
        this.defectsChart.data.datasets[0].data = newData;
        this.defectsChart.update('active');
    }

    // Update last update time
    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit'
        });
        document.getElementById('lastUpdate').textContent = timeString;
    }

    // Start auto-refresh functionality
    startAutoRefresh() {
        this.autoRefreshInterval = setInterval(() => {
            this.refreshData();
        }, 30000); // Refresh every 30 seconds
    }

    // Refresh data with small variations
    refreshData() {
        // Re-integrate quality metrics on each refresh
        this.integrateQualityMetrics();
        
        // Generate small variations in data
        vceData.generateVariation();
        
        // Update displays
        this.updateKPICards();
        this.updateDefectsTable();
        this.updateLastUpdateTime();
        
        // Add subtle animation to indicate refresh
        this.animateRefresh();
    }

    // Add refresh animation
    animateRefresh() {
        const cards = document.querySelectorAll('.kpi-card');
        cards.forEach(card => {
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        });
    }

    // Stop auto-refresh (for cleanup)
    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
    }

    // Method to export current data (for debugging/admin)
    exportData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            lineInfo: vceData.lineInfo,
            currentKPIs: vceData.qualityKPIs,
            defects: vceData.topDefects,
            comparisons: vceData.volvoLines
        };
        
        console.log('VCE Dashboard Export:', exportData);
        return exportData;
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.vceDashboard = new VCEDashboard();
});

// Handle page visibility change to pause/resume auto-refresh
document.addEventListener('visibilitychange', () => {
    if (window.vceDashboard) {
        if (document.hidden) {
            window.vceDashboard.stopAutoRefresh();
        } else {
            window.vceDashboard.startAutoRefresh();
        }
    }
});

// Export for global access
window.VCEDashboard = VCEDashboard;
