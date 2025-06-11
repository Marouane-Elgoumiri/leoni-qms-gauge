// Dashboard.js - Main functionality for LEONI Quality Dashboard
class ProductionDashboard {
    constructor() {
        this.defectsChart = null;
        this.linesChart = null;
        this.init();
    }

    init() {
        this.loadInitialData();
        this.setupCharts();
        this.startAutoRefresh();
    }

    loadInitialData() {
        // Update defect number
        document.getElementById('defectNumber').textContent = mockData.totalDefects;
        
        // Update quality scores
        document.getElementById('score5S').textContent = mockData.qualityScores.score5S + '%';
        document.getElementById('scoreAFP').textContent = mockData.qualityScores.scoreAFP + '%';
        
        // Update KPI grid
        this.updateKPIGrid();
        
        // Add animation to defect number
        this.animateDefectNumber();
    }

    updateKPIGrid() {
        const kpiGrid = document.getElementById('kpiGrid');
        kpiGrid.innerHTML = '';
        
        mockData.kpiData.forEach(kpi => {
            const kpiItem = document.createElement('div');
            kpiItem.className = 'kpi-item';
            
            const trendIcon = this.getTrendIcon(kpi.trend);
            
            kpiItem.innerHTML = `
                <div class="kpi-value">${kpi.value} ${trendIcon}</div>
                <div class="kpi-label">${kpi.label}</div>
            `;
            
            kpiGrid.appendChild(kpiItem);
        });
    }

    getTrendIcon(trend) {
        switch(trend) {
            case 'up': return '📈';
            case 'down': return '📉';
            case 'stable': return '➡️';
            default: return '';
        }
    }

    animateDefectNumber() {
        const element = document.getElementById('defectNumber');
        const targetValue = mockData.totalDefects;
        let currentValue = 0;
        const increment = Math.ceil(targetValue / 30);
        
        const animate = () => {
            if (currentValue < targetValue) {
                currentValue = Math.min(currentValue + increment, targetValue);
                element.textContent = currentValue;
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    setupCharts() {
        this.createDefectsChart();
        this.createLinesChart();
    }

    createDefectsChart() {
        const ctx = document.getElementById('defectsChart').getContext('2d');
        
        const labels = mockData.topDefects.map(defect => defect.name);
        const data = mockData.topDefects.map(defect => defect.count);
        const colors = mockData.colorSchemes.defects;

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
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 15,
                        titleFont: {
                            size: 16,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 14
                        },
                        callbacks: {
                            label: function(context) {
                                const defect = mockData.topDefects[context.dataIndex];
                                return [
                                    `Count: ${context.parsed.y}`,
                                    `Severity: ${defect.severity.toUpperCase()}`,
                                    `Trend: ${defect.trend}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#6B7280',
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6B7280',
                            font: {
                                size: 11
                            },
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                },
                elements: {
                    bar: {
                        borderRadius: 8
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    createLinesChart() {
        const ctx = document.getElementById('linesChart').getContext('2d');
        
        const labels = mockData.topLines.map(line => line.name.split(' - ')[0]); // Shorter labels
        const defectData = mockData.topLines.map(line => line.defectCount);
        const efficiencyData = mockData.topLines.map(line => parseFloat(line.efficiency));
        
        this.linesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Defects Count',
                        data: defectData,
                        borderColor: '#FF6B6B',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#FF6B6B',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Efficiency %',
                        data: efficiencyData,
                        borderColor: '#4ECDC4',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#4ECDC4',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 15,
                        titleFont: {
                            size: 16,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 14
                        },
                        callbacks: {
                            label: function(context) {
                                const line = mockData.topLines[context.dataIndex];
                                if (context.datasetIndex === 0) {
                                    return [
                                        `Defects: ${context.parsed.y}`,
                                        `Status: ${line.status.toUpperCase()}`
                                    ];
                                } else {
                                    return `Efficiency: ${context.parsed.y}%`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Defects Count',
                            color: '#FF6B6B',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(255, 107, 107, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#FF6B6B',
                            font: {
                                size: 11
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Efficiency %',
                            color: '#4ECDC4',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            color: '#4ECDC4',
                            font: {
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#6B7280',
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    refreshDashboard() {
        // Refresh mock data
        refreshMockData();
        
        // Update UI elements
        this.loadInitialData();
        
        // Update charts
        if (this.defectsChart) {
            this.defectsChart.data.datasets[0].data = mockData.topDefects.map(defect => defect.count);
            this.defectsChart.update('active');
        }
        
        if (this.linesChart) {
            this.linesChart.data.datasets[0].data = mockData.topLines.map(line => line.defectCount);
            this.linesChart.data.datasets[1].data = mockData.topLines.map(line => parseFloat(line.efficiency));
            this.linesChart.update('active');
        }
        
        // Add visual feedback for refresh
        this.showRefreshIndicator();
    }

    showRefreshIndicator() {
        // Create a subtle refresh indicator
        const indicator = document.createElement('div');
        indicator.innerHTML = '🔄 Data refreshed';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        // Add animation keyframes
        if (!document.getElementById('refreshStyles')) {
            const style = document.createElement('style');
            style.id = 'refreshStyles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(indicator);
            }, 300);
        }, 2000);
    }

    startAutoRefresh() {
        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.refreshDashboard();
        }, mockData.refreshInterval);
    }

    destroy() {
        if (this.defectsChart) {
            this.defectsChart.destroy();
        }
        if (this.linesChart) {
            this.linesChart.destroy();
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const dashboard = new ProductionDashboard();
    
    // Manual refresh button (optional - could be added to HTML)
    window.refreshDashboard = () => dashboard.refreshDashboard();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        dashboard.destroy();
    });
});

// Add some additional utility functions
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getStatusColor(status) {
    const colors = {
        'excellent': '#4CAF50',
        'good': '#8BC34A',
        'normal': '#FFC107',
        'attention': '#FF9800',
        'critical': '#F44336'
    };
    return colors[status] || '#6B7280';
}
