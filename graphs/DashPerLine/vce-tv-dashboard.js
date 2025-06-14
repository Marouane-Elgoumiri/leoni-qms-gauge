// VCE TV Production Dashboard - LEONI Quality System
class VCETVDashboard {
    constructor() {
        this.defectsChart = null;
        this.currentPage = 0;
        this.totalPages = 2;
        this.pageInterval = 10000; // 10 seconds
        this.pageTimer = null;
        this.progressTimer = null;
        this.autoRefreshInterval = null;
        this.init();
    }

    init() {
        this.loadInitialData();
        this.setupCharts();
        this.startPageRotation();
        this.startAutoRefresh();
        this.updateLastUpdateTime();
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
        
        // Update each KPI card
        Object.keys(kpis).forEach(kpiName => {
            const kpiData = kpis[kpiName];
            const value = kpiData.value;
            const status = vceData.getKPIStatus(kpiName, parseFloat(value));
            
            // Update card class for color coding
            const card = document.getElementById(`${kpiName}Card`) || 
                        document.getElementById(`${this.getCardId(kpiName)}Card`);
            if (card) {
                card.className = `kpi-card ${status}`;
            }
            
            // Update value display
            const valueElement = document.getElementById(this.getElementId(kpiName));
            if (valueElement) {
                if (kpiName === 'processCapability') {
                    valueElement.textContent = value;
                } else if (kpiName === 'defectRate' || kpiName === 'customerComplaints') {
                    valueElement.textContent = `${value} PPM`;
                } else if (kpiName === 'defectCount') {
                    valueElement.textContent = value;
                } else {
                    valueElement.textContent = `${value}%`;
                }
            }
            
            // Update trend indicators
            this.updateTrendIndicator(kpiName, kpiData.trend, kpiData.trendValue);
        });
    }

    // Helper method to get element ID
    getElementId(kpiName) {
        const mapping = {
            defectRate: 'defectRate',
            firstPassYield: 'firstPassYield',
            defectCount: 'totalDefectCount',
            reworkRate: 'reworkRate',
            processCapability: 'processCapability',
            customerComplaints: 'customerComplaints',
            audit5S: 'audit5S',
            auditAFP: 'auditAFP',
            lineEfficiency: 'lineEfficiency',
            scrapRate: 'scrapRate'
        };
        return mapping[kpiName] || kpiName;
    }

    // Helper method to get card ID
    getCardId(kpiName) {
        const mapping = {
            defectRate: 'defectRate',
            firstPassYield: 'fpy',
            defectCount: 'defectCount',
            reworkRate: 'rework',
            processCapability: 'cpk',
            customerComplaints: 'customer',
            audit5S: 'audit5s',
            auditAFP: 'auditAfp',
            lineEfficiency: 'lineEfficiency',
            scrapRate: 'scrap'
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
                <td><strong>${defect.count}</strong></td>
                <td><span class="severity-badge severity-${defect.severity}">${defect.severity.toUpperCase()}</span></td>
                <td><strong>${defect.ppm}</strong></td>
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
        const colors = [
            '#ef4444', // Red for high severity
            '#f59e0b', // Orange for medium severity
            '#10b981', // Green for low severity
            '#3b82f6', // Blue for info
            '#8b5cf6'  // Purple for other
        ];

        this.defectsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Defects',
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors.map(color => color + 'CC'),
                    borderWidth: 3,
                    borderRadius: 12,
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
                        cornerRadius: 12,
                        displayColors: false,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(148, 163, 184, 0.3)',
                            lineWidth: 2
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 11,
                                weight: 'bold'
                            },
                            maxRotation: 45
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // Page rotation system
    startPageRotation() {
        // Update progress bar
        this.updateProgressBar();
        
        // Set up page rotation timer
        this.pageTimer = setInterval(() => {
            this.switchToNextPage();
        }, this.pageInterval);
    }

    switchToNextPage() {
        const currentPageElement = document.getElementById(`page${this.currentPage + 1}`);
        const nextPageIndex = (this.currentPage + 1) % this.totalPages;
        const nextPageElement = document.getElementById(`page${nextPageIndex + 1}`);

        // Update page indicators
        this.updatePageIndicators(nextPageIndex);

        // Animate page transition
        currentPageElement.classList.remove('active');
        currentPageElement.classList.add('slide-out-left');

        setTimeout(() => {
            nextPageElement.classList.add('active');
            nextPageElement.classList.remove('slide-in-right');
            
            // Reset previous page
            currentPageElement.classList.remove('slide-out-left');
            currentPageElement.classList.add('slide-in-right');
        }, 400);

        this.currentPage = nextPageIndex;
        this.updateProgressBar();
    }

    updatePageIndicators(activePage) {
        const indicators = document.querySelectorAll('.indicator-dot');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activePage);
        });
    }

    updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        let progress = 0;
        
        // Reset progress bar
        progressBar.style.width = '0%';
        
        // Clear existing progress timer
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
        }
        
        // Animate progress bar over 10 seconds
        this.progressTimer = setInterval(() => {
            progress += 1;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(this.progressTimer);
                progress = 0;
            }
        }, this.pageInterval / 100);
    }

    // Auto-refresh data
    startAutoRefresh() {
        this.autoRefreshInterval = setInterval(() => {
            this.refreshData();
        }, 30000); // 30 seconds
    }

    refreshData() {
        // Generate new variations
        vceData.generateVariation();
        
        // Update displays
        this.updateKPICards();
        this.updateDefectsTable();
        this.updateLastUpdateTime();
        
        // Update chart if on charts page
        if (this.currentPage === 1 && this.defectsChart) {
            const newData = vceData.topDefects.map(defect => defect.count);
            this.defectsChart.data.datasets[0].data = newData;
            this.defectsChart.update('none');
        }
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

    // Cleanup method
    destroy() {
        if (this.pageTimer) clearInterval(this.pageTimer);
        if (this.progressTimer) clearInterval(this.progressTimer);
        if (this.autoRefreshInterval) clearInterval(this.autoRefreshInterval);
        if (this.defectsChart) this.defectsChart.destroy();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vceTVDashboard = new VCETVDashboard();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause timers when page is hidden
        if (window.vceTVDashboard) {
            clearInterval(window.vceTVDashboard.pageTimer);
            clearInterval(window.vceTVDashboard.progressTimer);
        }
    } else {
        // Resume timers when page becomes visible
        if (window.vceTVDashboard) {
            window.vceTVDashboard.startPageRotation();
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.vceTVDashboard && window.vceTVDashboard.defectsChart) {
        window.vceTVDashboard.defectsChart.resize();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.vceTVDashboard) {
        window.vceTVDashboard.destroy();
    }
});
