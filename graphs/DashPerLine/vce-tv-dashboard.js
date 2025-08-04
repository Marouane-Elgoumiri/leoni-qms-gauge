// VCE TV Production Dashboard - LEONI Quality System
class VCETVDashboard {
    constructor() {
        this.defectsChart = null;
        this.gauge = null;
        // Custom page order: page3, page1, page2, page4
        this.pageOrder = ['page3', 'page1', 'page2', 'page4'];
        this.currentPageIndex = 0;
        this.pageInterval = 20000; // 20 seconds
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

    // KPI values with auto-calculated accurate trends
    updateKPICards() {
        // Define current KPI data with realistic trend calculations
        const kpiData = {
            externalPpm: { current: 59, target: 62, previousValue: 61.5, unit: 'PPM', isLowerBetter: true },
            internalPpm: { current: 1669, target: 3156, previousValue: 1789, unit: 'PPM', isLowerBetter: true },
            totalDefectCount: { current: 145, target: 0, previousValue: 152, unit: '', isLowerBetter: true },
            lineEfficiency: { current: 52.6, target: 70, previousValue: 51.2, unit: '%', isLowerBetter: false },
            scrapWeight: { current: { kg: 1141, gh: 410 }, target: { kg: 0.5, gh: 0.05 }, previousValue: { kg: 1198, gh: 428 }, unit: 'kg', isLowerBetter: true },
            rftRate: { current: 99.83, target: 96, previousValue: 99.71, unit: '%', isLowerBetter: false },
            reworkRate: { current: 0.285, target: 2, previousValue: 0.31, unit: '%', isLowerBetter: true },
            audit5S: { current: 92, target: 95, previousValue: 90.5, unit: '%', isLowerBetter: false },
            auditAFP: { current: 91, target: 95, previousValue: 91.2, unit: '%', isLowerBetter: false },
            customerComplaints: { current: 5, target: 0, previousValue: 6, unit: '', isLowerBetter: true }
        };

        // External PPM
        const externalPpmEl = document.getElementById('externalPpm');
        if (externalPpmEl) externalPpmEl.textContent = kpiData.externalPpm.current;
        this.updateTrendForKPI('externalPpmTrend', kpiData.externalPpm);

        // Internal PPM
        const internalPpmEl = document.getElementById('internalPpm');
        if (internalPpmEl) internalPpmEl.textContent = kpiData.internalPpm.current;
        this.updateTrendForKPI('internalPpmTrend', kpiData.internalPpm);

        // NBR of defects
        const defectCountEl = document.getElementById('totalDefectCount');
        if (defectCountEl) defectCountEl.textContent = kpiData.totalDefectCount.current;
        this.updateTrendForKPI('defectCountTrend', kpiData.totalDefectCount);

        // Efficiency
        const lineEfficiencyEl = document.getElementById('lineEfficiency');
        if (lineEfficiencyEl) lineEfficiencyEl.textContent = kpiData.lineEfficiency.current + '%';
        this.updateTrendForKPI('efficiencyTrend', kpiData.lineEfficiency);

        // Scrap
        const scrapWeightEl = document.getElementById('scrapWeight');
        if (scrapWeightEl) scrapWeightEl.textContent = `${kpiData.scrapWeight.current.kg} kg / ${kpiData.scrapWeight.current.gh} g/h`;
        this.updateTrendForKPI('scrapTrend', {
            current: kpiData.scrapWeight.current.kg,
            previousValue: kpiData.scrapWeight.previousValue.kg,
            isLowerBetter: true,
            unit: 'kg'
        });

        // RFT
        const rftRateEl = document.getElementById('rftRate');
        if (rftRateEl) rftRateEl.textContent = kpiData.rftRate.current + '%';
        this.updateTrendForKPI('rftRateTrend', kpiData.rftRate);

        // Rework Rate
        const reworkRateEl = document.getElementById('reworkRate');
        if (reworkRateEl) reworkRateEl.textContent = kpiData.reworkRate.current + '%';
        this.updateTrendForKPI('reworkRateTrend', kpiData.reworkRate);

        // 5S Score
        const audit5SEl = document.getElementById('audit5S');
        if (audit5SEl) audit5SEl.textContent = kpiData.audit5S.current + '%';
        this.updateTrendForKPI('audit5sTrend', kpiData.audit5S);

        // AFP Score
        const auditAFPEl = document.getElementById('auditAFP');
        if (auditAFPEl) auditAFPEl.textContent = kpiData.auditAFP.current + '%';
        this.updateTrendForKPI('auditAfpTrend', kpiData.auditAFP);

        // Customer Complaints
        const customerComplaintsEl = document.getElementById('customerComplaints');
        if (customerComplaintsEl) customerComplaintsEl.textContent = kpiData.customerComplaints.current;
        this.updateTrendForKPI('customerTrend', kpiData.customerComplaints);
    }

    // Auto-calculate and update trend for a specific KPI
    updateTrendForKPI(trendElementId, kpiData) {
        const trendElement = document.getElementById(trendElementId);
        if (!trendElement) return;

        const difference = kpiData.current - kpiData.previousValue;
        const percentChange = Math.abs((difference / kpiData.previousValue) * 100);
        
        let trendDirection, trendClass, iconClass, displayText;
        
        // Determine trend direction and whether it's good or bad
        if (Math.abs(difference) < 0.01) {
            // Essentially no change
            trendDirection = 'stable';
            trendClass = 'trend-stable';
            iconClass = 'fas fa-minus';
            displayText = `${difference >= 0 ? '+' : ''}${difference.toFixed(kpiData.unit === '%' ? 1 : 0)}${kpiData.unit}`;
        } else if (difference > 0) {
            // Value increased
            if (kpiData.isLowerBetter) {
                // Increase is bad (red)
                trendClass = 'trend-up-bad';
                iconClass = 'fas fa-arrow-up';
            } else {
                // Increase is good (green)
                trendClass = 'trend-up';
                iconClass = 'fas fa-arrow-up';
            }
            displayText = `+${Math.abs(difference).toFixed(kpiData.unit === '%' ? 1 : 0)}${kpiData.unit}`;
        } else {
            // Value decreased
            if (kpiData.isLowerBetter) {
                // Decrease is good (green)
                trendClass = 'trend-down';
                iconClass = 'fas fa-arrow-down';
            } else {
                // Decrease is bad (red)
                trendClass = 'trend-down-bad';
                iconClass = 'fas fa-arrow-down';
            }
            displayText = `-${Math.abs(difference).toFixed(kpiData.unit === '%' ? 1 : 0)}${kpiData.unit}`;
        }

        // Update the trend element
        trendElement.className = `kpi-trend ${trendClass}`;
        const icon = trendElement.querySelector('i');
        const span = trendElement.querySelector('span');
        
        if (icon) icon.className = iconClass;
        if (span) span.textContent = displayText;
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
        // Define unique colors for each defect (must match chart)
        const defectColors = [
            '#ef4444', // Branche courte
            '#f59e0b', // Inversion
            '#10b981', // Non verrouillé
            '#3b82f6', // Element endommagé
            '#8b5cf6', // Manque element
            '#da4bb8ff', // Erreur clip (unique teal)
            '#746c55ff', // Adapter misaligned (brown)
            '#1b08eaff', // Extra clip (deep blue)
            '#e67e22', // Unique orange for Adapter misaligned
            '#16a085'  // Unique teal-green for Extra clip
        ];
        vceData.topDefects.forEach((defect, index) => {
            const color = defectColors[index] || '#64748b';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="defect-name-cell">
                    <span class="defect-color-indicator" style="background:${color};"></span>
                    ${defect.name}
                </td>
                <td><strong>${defect.count}</strong></td>
                <td><span class="severity-badge severity-${defect.severity}">${defect.severity.toUpperCase()}</span></td>
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
        // Unique color for each defect (must match table)
        const colors = [
            '#ef4444', // Branche courte
            '#f59e0b', // Inversion
            '#10b981', // Non verrouillé
            '#3b82f6', // Element endommagé
            '#8b5cf6', // Manque element
            '#da4bb8ff', // Erreur clip (unique teal)
            '#746c55ff', // Adapter misaligned (brown)
            '#1b08eaff', // Extra clip (deep blue)
            '#e67e22', // Unique orange for Adapter misaligned
            '#16a085'  // Unique teal-green for Extra clip
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
                        backgroundColor: 'rgba(194, 171, 171, 0.8)',
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
                            color: '#000000ff',
                            font: {
                                size: 13,
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#000000ff',
                            font: {
                                size: 13,
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
            // Set to NBR defects (should match the KPI card value)
            defectCountElement.textContent = '145';
        }

        if (defectRateElement) {
            defectRateElement.textContent = `${Math.floor(value * 2)} PPM`;
        }
    }

    // Page rotation system
    startPageRotation() {
        this.updateProgressBar();
        this.showPage(this.currentPageIndex);
        this.pageTimer = setInterval(() => {
            this.switchToNextPage();
        }, this.pageInterval);
    }

    switchToNextPage() {
        const prevIndex = this.currentPageIndex;
        this.currentPageIndex = (this.currentPageIndex + 1) % this.pageOrder.length;
        this.showPage(this.currentPageIndex, prevIndex);
        this.updateProgressBar();
        // Play alert sound when reaching the Flash Qualité page
        if (this.pageOrder[this.currentPageIndex] === 'page4') {
            this.playAlertSound();
        }
    }

    showPage(index, prevIndex = null) {
        // Hide all pages
        this.pageOrder.forEach(pid => {
            const el = document.getElementById(pid);
            if (el) el.classList.remove('active', 'slide-out-left', 'slide-in-right');
        });
        // Animate transition if previous page exists
        if (prevIndex !== null) {
            const prevPage = document.getElementById(this.pageOrder[prevIndex]);
            if (prevPage) {
                prevPage.classList.remove('active');
                prevPage.classList.add('slide-out-left');
            }
        }
        // Show new page
        const newPage = document.getElementById(this.pageOrder[index]);
        if (newPage) {
            newPage.classList.add('active');
            newPage.classList.remove('slide-in-right');
        }
        // Handle header/indicator visibility for PDF page
        const header = document.querySelector('.header');
        const refreshIndicator = document.querySelector('.refresh-indicator');
        const pageIndicator = document.querySelector('.page-indicator');
        const progressBar = document.getElementById('progressBar');
        if (this.pageOrder[index] === 'page4') {
            if (header) header.style.display = 'none';
            if (refreshIndicator) refreshIndicator.style.display = 'none';
            if (pageIndicator) pageIndicator.style.display = 'none';
            if (progressBar) progressBar.style.display = 'none';
        } else {
            if (header) header.style.display = 'flex';
            if (refreshIndicator) refreshIndicator.style.display = 'flex';
            if (pageIndicator) pageIndicator.style.display = 'flex';
            if (progressBar) progressBar.style.display = 'block';
        }
        // Update page indicators
        this.updatePageIndicators(index);
    }

    updatePageIndicators(activeIndex) {
        const indicators = document.querySelectorAll('.indicator-dot');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndex);
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
