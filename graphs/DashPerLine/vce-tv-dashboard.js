// VCE TV Production Dashboard - LEONI Quality System
class VCETVDashboard {
    constructor() {
        this.defectsChart = null;
        this.gauge = null;
        this.currentPage = 0;
        this.totalPages = 3;
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
        
        // Initialize gauge with initial quality score
        setTimeout(() => {
            if (this.gauge) {
                const initialScore = this.calculateQualityScore();
                this.updateGauge(initialScore);
            }
        }, 500); // Small delay to ensure gauge is created
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
        
        vceData.topDefects.forEach((defect, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="defect-name-cell">
                    <span class="defect-color-indicator defect-color-${index}"></span>
                    ${defect.name}
                </td>
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
        this.createGauge();
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

    // Create quality gauge
    createGauge() {
        // Wait for D3.js to be available
        if (typeof d3 === 'undefined') {
            console.error('D3.js not available for gauge creation');
            return;
        }

        const container = d3.select('#gaugeContainer');
        // GAUGE SIZE PARAMETERS - Make gauge even bigger to match larger container
        const width = 1200;  // Increased from 1000 - controls overall width
        const height = 650;  // Increased from 500 - controls overall height  
        const radius = Math.min(width, height) / 2.0;  // Increased from 2.2 to 2.0 - makes gauge fill even more space
        
        // Configuration for the gauge
        const config = {
            minValue: 0,
            maxValue: 100,
            transitionDuration: 750,
            arcInset: 20,       // Increased from 8 - spacing between arc segments
            arcWidth: 150,      // Increased from 120 - makes the arc bands even thicker/wider
            needle: {
                length: radius * 0.87,  // Increased from 0.85 - longer needle for bigger gauge
                width: 15,              // Increased from 12 - thicker needle
                circleRadius: 20        // Increased from 16 - bigger center circle
            },
            thresholds: [
                { value: 0, label: "Low", color: "#27AE60", class: "status-low" },
                { value: 20, label: "Medium", color: "#F39C12", class: "status-medium" },
                { value: 80, label: "High", color: "#E74C3C", class: "status-high" }
            ]
        };

        // Create SVG
        const svg = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 1.5})`);

        // Create gauge arcs
        this.createGaugeArcs(svg, radius, config);
        
        // Create needle
        const needleGroup = this.createNeedle(svg, config);
        
        // Add center circle
        svg.append("circle")
            .attr("class", "gauge-center")
            .attr("r", config.needle.circleRadius)
            .attr("cx", 0)
            .attr("cy", 0);

        // Add value display
        const valueDisplay = svg.append("text")
            .attr("class", "gauge-value-display")
            .attr("x", 0)
            .attr("y", 60)              // Increased from 40 - more space below center for bigger gauge
            .attr("text-anchor", "middle")
            .attr("font-size", "36px")   // Increased from 20px - even bigger value display
            .attr("font-weight", "bold")
            .attr("fill", "#2d3748")
            .text("0%");

        // Add tick marks and labels
        this.createGaugeIndicators(svg, radius, config);

        // Store gauge components
        this.gauge = {
            svg: svg,
            config: config,
            needleGroup: needleGroup,
            valueDisplay: valueDisplay
        };
    }

    createGaugeArcs(svg, radius, config) {
        const arcData = [];
        
        // Scale value to angle
        const scaleValue = (value) => {
            return d3.scaleLinear()
                .domain([config.minValue, config.maxValue])
                .range([0, Math.PI])
                (value);
        };

        // Create arc segments based on thresholds
        for (let i = 0; i < config.thresholds.length; i++) {
            if (i === config.thresholds.length - 1) break;
            
            const startValue = config.thresholds[i].value;
            const endValue = config.thresholds[i + 1].value;
            
            const startAngle = scaleValue(startValue) - Math.PI / 2;
            const endAngle = scaleValue(endValue) - Math.PI / 2;
            
            arcData.push({
                startAngle,
                endAngle,
                value: startValue,
                color: config.thresholds[i].color,
                class: config.thresholds[i].class,
                label: config.thresholds[i].label
            });
        }

        // Add the final segment
        const lastThreshold = config.thresholds[config.thresholds.length - 1];
        const startAngle = scaleValue(lastThreshold.value) - Math.PI / 2;
        const endAngle = Math.PI / 2;
        
        arcData.push({
            startAngle,
            endAngle,
            value: lastThreshold.value,
            color: lastThreshold.color,
            class: lastThreshold.class,
            label: lastThreshold.label
        });

        // Draw arc segments
        svg.selectAll(".gauge-arc")
            .data(arcData)
            .enter()
            .append("path")
            .attr("class", d => `gauge-arc ${d.class}`)
            .attr("fill", d => d.color)
            .attr("d", d => {
                return d3.arc()
                    .innerRadius(radius - config.arcWidth - config.arcInset)
                    .outerRadius(radius - config.arcInset)
                    .startAngle(d.startAngle)
                    .endAngle(d.endAngle)();
            });
    }

    createNeedle(svg, config) {
        // Create needle group
        const needleGroup = svg.append("g")
            .attr("class", "needle-group");
        
        // Create needle path
        const length = config.needle.length;
        const width = config.needle.width;
        const needlePath = `M -${width / 2}, 0 L 0, -${length} L ${width / 2}, 0 Z`;
        
        needleGroup.append("path")
            .attr("class", "needle")
            .attr("d", needlePath);

        // Return the needle group to be stored later
        return needleGroup;
    }

    createGaugeIndicators(svg, radius, config) {
        const tickCount = 11; // 0, 10, 20, ..., 100
        const tickLength = 25;    // Increased from 18 - longer tick marks for bigger gauge
        const labelOffset = 40;   // Increased from 30 - more space for labels
        const outerRadius = radius - config.arcInset;

        // Scale value to angle
        const scaleValue = (value) => {
            return d3.scaleLinear()
                .domain([config.minValue, config.maxValue])
                .range([0, Math.PI])
                (value);
        };

        // Create tick marks and labels
        for (let i = 0; i < tickCount; i++) {
            const value = config.minValue + (i * (config.maxValue - config.minValue) / (tickCount - 1));
            const angle = scaleValue(value) - Math.PI;
            
            // Tick marks
            const tickStartX = Math.cos(angle) * outerRadius;
            const tickStartY = Math.sin(angle) * outerRadius;
            const tickEndX = Math.cos(angle) * (outerRadius + tickLength);
            const tickEndY = Math.sin(angle) * (outerRadius + tickLength);
            
            svg.append('line')
                .attr('class', 'gauge-tick')
                .attr('x1', tickStartX)
                .attr('y1', tickStartY)
                .attr('x2', tickEndX)
                .attr('y2', tickEndY);

            // Labels
            const labelX = Math.cos(angle) * (outerRadius + tickLength + labelOffset);
            const labelY = Math.sin(angle) * (outerRadius + tickLength + labelOffset);

            svg.append('text')
                .attr('class', 'gauge-tick-label')
                .attr('x', labelX)
                .attr('y', labelY)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central')
                .attr('font-size', '16px')  // Increased from 14px for bigger gauge
                .text(Math.round(value) + '%');
        }

        // Add status labels on arcs
        config.thresholds.forEach((threshold, index) => {
            let segmentStartValue = threshold.value;
            let segmentEndValue = index < config.thresholds.length - 1 
                ? config.thresholds[index + 1].value 
                : config.maxValue;
            
            const middleValue = (segmentStartValue + segmentEndValue) / 2;
            const angle = scaleValue(middleValue) - Math.PI;
            
            const arcMiddleRadius = (outerRadius + (radius - config.arcWidth - config.arcInset)) / 2;
            const labelX = Math.cos(angle) * arcMiddleRadius;
            const labelY = Math.sin(angle) * arcMiddleRadius;
            
            svg.append("text")
                .attr("class", "gauge-status-label")
                .attr("x", labelX)
                .attr("y", labelY)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("font-size", "20px")  // Increased from 16px for bigger gauge
                .text(threshold.label.toUpperCase());
        });
    }

    updateGauge(value) {
        if (!this.gauge) return;

        // Scale value to angle
        const scaleValue = (val) => {
            return d3.scaleLinear()
                .domain([this.gauge.config.minValue, this.gauge.config.maxValue])
                .range([0, Math.PI])
                (val);
        };

        // Update needle position
        const angle = scaleValue(value) - Math.PI / 2;
        this.gauge.needleGroup.transition()
            .duration(this.gauge.config.transitionDuration)
            .attr("transform", `rotate(${angle * 180 / Math.PI})`);

        // Update value display
        this.gauge.valueDisplay.text(value + "%");

        // Update status information
        this.updateGaugeInfo(value);
    }

    updateGaugeInfo(value) {
        // Determine status
        let status = "Low";
        let statusColor = "#27AE60";
        
        if (value >= 80) {
            status = "High";
            statusColor = "#E74C3C";
        } else if (value >= 20) {
            status = "Medium";
            statusColor = "#F39C12";
        }

        // Update status elements
        const statusElement = document.getElementById('currentStatus');
        const defectCountElement = document.getElementById('currentDefectCount');
        const defectRateElement = document.getElementById('currentDefectRate');

        if (statusElement) {
            statusElement.textContent = status;
            statusElement.style.color = statusColor;
        }

        if (defectCountElement) {
            // Calculate total defect count from vceData
            const totalDefects = vceData.topDefects.reduce((sum, defect) => sum + defect.count, 0);
            defectCountElement.textContent = totalDefects;
        }

        if (defectRateElement) {
            defectRateElement.textContent = `${Math.floor(value * 2)} PPM`;
        }
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

        // Update gauge if on gauge page
        if (this.currentPage === 2 && this.gauge) {
            // Calculate overall quality score from KPIs
            const qualityScore = this.calculateQualityScore();
            this.updateGauge(qualityScore);
        }
    }

    calculateQualityScore() {
        const kpis = vceData.qualityKPIs;
        
        // Convert various KPIs to a 0-100 quality score
        // Lower defect rate = higher quality
        const defectScore = Math.max(0, 100 - (parseFloat(kpis.defectRate.value) * 5));
        
        // Higher first pass yield = higher quality
        const fpyScore = parseFloat(kpis.firstPassYield.value);
        
        // Lower rework rate = higher quality
        const reworkScore = Math.max(0, 100 - (parseFloat(kpis.reworkRate.value) * 20));
        
        // Average the scores
        const overallScore = Math.round((defectScore + fpyScore + reworkScore) / 3);
        
        return Math.min(100, Math.max(0, overallScore));
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
        if (this.gauge && this.gauge.svg) this.gauge.svg.remove();
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
