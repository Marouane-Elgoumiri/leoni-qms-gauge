// VCE TV Production Dashboard - LEONI Quality System
class VCETVDashboard {
    constructor() {
        this.defectsChart = null;
        this.gauge = null;
        this.currentPage = 0;
        this.totalPages = 4; // Updated to 4 pages
        this.pageInterval = 10000; // 10 seconds
        this.pageTimer = null;
        this.progressTimer = null;
        this.autoRefreshInterval = null;
        this.alertSound = null;
        this.qualityMetricsIntegrated = false;
        this.init();
    }

    init() {
        this.initializeAlertSound();
        this.loadInitialData();
        this.setupCharts();
        this.startPageRotation();
        this.startAutoRefresh();
        this.updateLastUpdateTime();
        this.integrateQualityMetrics();
    }

    // Integrate manually entered quality metrics
    integrateQualityMetrics() {
        try {
            // Check if quality metrics functions are available
            if (typeof getQualityMetricsForLine === 'function') {
                const manualMetrics = getQualityMetricsForLine('IVECO');

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
                
                if (manualMetrics.customerComplaints >= 0) {
                    vceData.qualityKPIs.customerComplaints.value = manualMetrics.customerComplaints;
                    vceData.qualityKPIs.customerComplaints.trend = this.calculateTrend('complaints', manualMetrics.customerComplaints);
                }
                
                if (manualMetrics.defectRatePPM > 0) {
                    vceData.qualityKPIs.defectRate.value = manualMetrics.defectRatePPM;
                    vceData.qualityKPIs.defectRate.trend = this.calculateTrend('defect', manualMetrics.defectRatePPM);
                }
                
                this.qualityMetricsIntegrated = true;
                console.log('TV Dashboard - Quality metrics integrated successfully:', manualMetrics);
            } else {
                console.warn('TV Dashboard - Quality metrics functions not available - using mock data');
            }

            // Check if technician metrics functions are available
            if (typeof getTechnicianMetricsForLine === 'function') {
                const technicianMetrics = getTechnicianMetricsForLine('IVECO');
                
                // Override mock data with technician entries if available
                if (technicianMetrics.fpy > 0) {
                    vceData.qualityKPIs.firstPassYield.value = technicianMetrics.fpy.toFixed(1);
                    vceData.qualityKPIs.firstPassYield.trend = this.calculateTrend('fpy', technicianMetrics.fpy);
                }
                
                if (technicianMetrics.cpk > 0) {
                    vceData.qualityKPIs.processCapability.value = technicianMetrics.cpk.toFixed(2);
                    vceData.qualityKPIs.processCapability.trend = this.calculateTrend('cpk', technicianMetrics.cpk);
                }
                
                console.log('TV Dashboard - Technician metrics integrated successfully:', technicianMetrics);
            } else {
                console.warn('TV Dashboard - Technician metrics functions not available - using mock data');
            }
        } catch (error) {
            console.warn('TV Dashboard - Error integrating quality metrics:', error);
        }
    }

    // Calculate trend based on historical data
    calculateTrend(metricType, currentValue) {
        try {
            if (typeof getQualityMetricsHistory === 'function') {
                const history = getQualityMetricsHistory('IVECO', metricType, 7); // Last 7 days
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

    // Initialize alert sound for Flash Qualité page
    initializeAlertSound() {
        // Create audio context for alert sound
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Audio context not supported');
        }
    }

    // Play alert sound when reaching Flash Qualité page
    playAlertSound() {
        if (!this.audioContext) return;

        try {
            // Create a simple alert tone using Web Audio API
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Alert tone configuration
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.2);
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.4);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.6);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.6);
        } catch (e) {
            console.warn('Could not play alert sound:', e);
        }
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

    // Completely static KPI values, no dynamic update or override
    updateKPICards() {
        // Customer Complaints
        const customerComplaints = document.getElementById('customerComplaints');
        if (customerComplaints) customerComplaints.textContent = '0/5';
        const customerComplaintsTarget = document.getElementById('customerComplaintsTarget');
        if (customerComplaintsTarget) customerComplaintsTarget.textContent = 'Target: 0';

        // PPM External
        const defectRate = document.getElementById('defectRate');
        if (defectRate) defectRate.textContent = '59';
        const defectRateTarget = document.getElementById('defectRateTarget');
        if (defectRateTarget) defectRateTarget.textContent = 'Target: 62';

        // RFT
        const rftRate = document.getElementById('rftRate');
        if (rftRate) rftRate.textContent = '99.83%';
        const rftRateTarget = document.getElementById('rftRateTarget');
        if (rftRateTarget) rftRateTarget.textContent = 'Target: 96%';

        // PPM Internal (NBR of defect)
        const defectCount = document.getElementById('totalDefectCount');
        if (defectCount) defectCount.textContent = '145';
        const defectCountTarget = document.getElementById('totalDefectCountTarget');
        if (defectCountTarget) defectCountTarget.textContent = '';

        // Rework Rate
        const reworkRate = document.getElementById('reworkRate');
        if (reworkRate) reworkRate.textContent = '0.285%';
        const reworkRateTarget = document.getElementById('reworkRateTarget');
        if (reworkRateTarget) reworkRateTarget.textContent = 'Target: 2%';

        // Scrap
        const scrapWeight = document.getElementById('scrapWeight');
        if (scrapWeight) scrapWeight.textContent = 'G/H : 410 / Kg : 1141';
        const scrapWeightTarget = document.getElementById('scrapWeightTarget');
        if (scrapWeightTarget) scrapWeightTarget.textContent = 'Target: 0.5 kg / 0.05 kg/h';

        // Efficiency
        const lineEfficiency = document.getElementById('lineEfficiency');
        if (lineEfficiency) lineEfficiency.textContent = '52.6%';
        const lineEfficiencyTarget = document.getElementById('lineEfficiencyTarget');
        if (lineEfficiencyTarget) lineEfficiencyTarget.textContent = 'Target: 70%';

        // AFP
        const auditAFP = document.getElementById('auditAFP');
        if (auditAFP) auditAFP.textContent = '91%';
        const auditAFPTarget = document.getElementById('auditAFPTarget');
        if (auditAFPTarget) auditAFPTarget.textContent = 'Target: 95%';

        // 5S
        const audit5S = document.getElementById('audit5S');
        if (audit5S) audit5S.textContent = '92%';
        const audit5STarget = document.getElementById('audit5STarget');
        if (audit5STarget) audit5STarget.textContent = 'Target: 95%';
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
        if (kpiName === 'scrapWeight') return 'g';
        if (kpiName === 'reworkStatus') return '';
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

        // Force gauge value to be in 'Low' status (below 20)
        let lowValue = 10; // Always below 20 for 'Low' status
        // Scale value to angle
        const scaleValue = (val) => {
            return d3.scaleLinear()
                .domain([this.gauge.config.minValue, this.gauge.config.maxValue])
                .range([0, Math.PI])
                (val);
        };

        // Update needle position
        const angle = scaleValue(lowValue) - Math.PI / 2;
        this.gauge.needleGroup.transition()
            .duration(this.gauge.config.transitionDuration)
            .attr("transform", `rotate(${angle * 180 / Math.PI})`);

        // Update value display
        this.gauge.valueDisplay.text(lowValue + "%");

        // Update status information
        this.updateGaugeInfo(lowValue);
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

        // Handle header visibility for Flash Qualité page (page 4 = index 3)
        const header = document.querySelector('.header');
        const refreshIndicator = document.querySelector('.refresh-indicator');
        const pageIndicator = document.querySelector('.page-indicator');
        const progressBar = document.getElementById('progressBar');
        
        if (nextPageIndex === 3) {
            // Hide header and indicators for Flash Qualité page
            if (header) header.style.display = 'none';
            if (refreshIndicator) refreshIndicator.style.display = 'none';
            if (pageIndicator) pageIndicator.style.display = 'none';
            if (progressBar) progressBar.style.display = 'none';
        } else {
            // Show header and indicators for other pages
            if (header) header.style.display = 'flex';
            if (refreshIndicator) refreshIndicator.style.display = 'flex';
            if (pageIndicator) pageIndicator.style.display = 'flex';
            if (progressBar) progressBar.style.display = 'block';
        }

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
        
        // Play alert sound when reaching the Flash Qualité page (page 4 = index 3)
        if (nextPageIndex === 3) {
            this.playAlertSound();
        }
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
        // Re-integrate quality metrics on each refresh
        this.integrateQualityMetrics();
        
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
        
        // Lower scrap weight = higher quality (convert grams to score)
        const scrapScore = Math.max(0, 100 - (parseFloat(kpis.scrapWeight.value) * 1.5)); // 1.5 multiplier for grams
        
        // Average the scores
        const overallScore = Math.round((defectScore + fpyScore + scrapScore) / 3);
        
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
