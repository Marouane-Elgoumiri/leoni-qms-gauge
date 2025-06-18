/**
 * LEONI QMS Defect Gauge Visualization
 * Created using D3.js - Recreated with proper positioning
 */

// Configuration for the gauge
const config = {
    minValue: 0,
    maxValue: 100,
    transitionDuration: 750,
    autoRotateInterval: 5000, // 5 seconds
    width: 1700, // Increased from 800
    height: 700,  // Increased from 400
    arcInset: 5,  // Increased slightly for better proportions
    arcWidth: 80, // Increased from 80
    needle: {
        length: 150, // Increased from 120
        width: 10,   // Increased from 8
        circleRadius: 18 // Increased from 15
    },
    thresholds: [
        { value: 0, label: "Low", color: "#27AE60", class: "status-low" },
        { value: 20, label: "Medium", color: "#F39C12", class: "status-medium" },
        { value: 80, label: "High", color: "#E74C3C", class: "status-high" }
    ]
};

// Function to generate random values based on status
function generateRandomValue(status) {
    switch(status) {
        case 'low':
            return Math.floor(Math.random() * 20); // 0-19
        case 'medium':
            return Math.floor(Math.random() * 60) + 20; // 20-79
        case 'high':
            return Math.floor(Math.random() * 20) + 80; // 80-99
        default:
            return Math.floor(Math.random() * 100);
    }
}

// Gauge class for visualization
class DefectGauge {
    constructor(containerId, config) {
        // Check if D3.js is available
        if (typeof d3 === 'undefined') {
            console.error('D3.js library is not loaded. Please ensure D3.js is properly included.');
            throw new Error('D3.js library is required for the gauge visualization.');
        }
        
        this.container = d3.select(containerId);
        this.config = config;
        this.currentDataIndex = 0;
        this.autoRotateTimer = null;
        
        // Verify container exists
        if (this.container.empty()) {
            console.error(`Container with selector "${containerId}" not found.`);
            throw new Error(`Container element "${containerId}" not found.`);
        }
        
        this.initializeGauge();
    }
    
    initializeGauge() {
        // Clear loading indicator
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
        
        const width = this.container.node().getBoundingClientRect().width;
        const height = this.container.node().getBoundingClientRect().height;
        
        // Calculate radius based on container size
        this.radius = Math.min(width, height) / 2;
        
        // Create SVG element
        this.svg = this.container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 1.5})`);
        
        // Create gauge arcs
        this.createGaugeArcs();
        
        // Create gauge needle
        this.createNeedle();
        
        // Add center circle
        this.svg.append("circle")
            .attr("class", "gauge-center")
            .attr("r", this.config.needle.circleRadius)
            .attr("cx", 0)
            .attr("cy", 0);
        
        // Add current value display in the center
        this.valueDisplay = this.svg.append("text")
            .attr("class", "gauge-value-display")
            .attr("x", 0)
            .attr("y", 50)
            .attr("text-anchor", "middle")
            .attr("font-size", "24px")
            .attr("font-weight", "bold")
            .attr("fill", "#464A4F")
            .text("0%");
        
        // Add value indicators
        this.createValueIndicators();
        
        // Initialize tooltip
        this.tooltip = d3.select("#tooltip");
        this.tooltipContent = d3.select("#tooltip-content");
    }
    
    createGaugeArcs() {
        // Arc generator for gauge
        const arcGenerator = d3.arc()
            .innerRadius(this.radius - this.config.arcWidth - this.config.arcInset)
            .outerRadius(this.radius - this.config.arcInset)
            .startAngle(-Math.PI / 2)
            .endAngle(Math.PI / 2);
        
        // Create arc segments based on thresholds
        this.arcData = [];
        
        for (let i = 0; i < this.config.thresholds.length; i++) {
            if (i === this.config.thresholds.length - 1) break;
            
            const startValue = this.config.thresholds[i].value;
            const endValue = this.config.thresholds[i + 1].value;
            
            const startAngle = this.scaleValue(startValue) - Math.PI / 2;
            const endAngle = this.scaleValue(endValue) - Math.PI / 2;
            
            this.arcData.push({
                startAngle,
                endAngle,
                value: startValue,
                color: this.config.thresholds[i].color,
                class: this.config.thresholds[i].class,
                label: this.config.thresholds[i].label
            });
        }
        
        // Add the final segment (from last threshold to max value)
        const lastThreshold = this.config.thresholds[this.config.thresholds.length - 1];
        const startAngle = this.scaleValue(lastThreshold.value) - Math.PI / 2;
        const endAngle = Math.PI / 2;
        
        this.arcData.push({
            startAngle,
            endAngle,
            value: lastThreshold.value,
            color: lastThreshold.color,
            class: lastThreshold.class,
            label: lastThreshold.label
        });
        
        // Draw arc segments
        this.arcs = this.svg.selectAll(".gauge-arc")
            .data(this.arcData)
            .enter()
            .append("path")
            .attr("class", d => `gauge-arc ${d.class}`)
            .attr("fill", d => d.color)
            .attr("d", d => {
                return d3.arc()
                    .innerRadius(this.radius - this.config.arcWidth - this.config.arcInset)
                    .outerRadius(this.radius - this.config.arcInset)
                    .startAngle(d.startAngle)
                    .endAngle(d.endAngle)();
            })
            .on("mouseover", (event, d) => {
                // Find the current data based on current value
                const currentData = this.getCurrentData();
                if (this.isValueInArcRange(currentData.value, d)) {
                    this.showTooltip(event, currentData);
                }
            })
            .on("mouseout", () => {
                this.hideTooltip();
            });
    }
    
    isValueInArcRange(value, arc) {
        const arcStartValue = this.inverseScaleValue(arc.startAngle + Math.PI / 2);
        const arcEndValue = this.inverseScaleValue(arc.endAngle + Math.PI / 2);
        return value >= arcStartValue && value <= arcEndValue;
    }
    
    createNeedle() {
        // Create needle group
        this.needleGroup = this.svg.append("g")
            .attr("class", "needle-group");
        
        // Create needle
        this.needle = this.needleGroup.append("path")
            .attr("class", "needle")
            .attr("d", this.getNeedlePath());
        
        // Set initial position
        this.updateNeedle(0);
    }
    
    getNeedlePath() {
        const length = this.config.needle.length;
        const width = this.config.needle.width;
        
        return `M -${width / 2}, 0 L 0, -${length} L ${width / 2}, 0 Z`;
    }
    
    // Scale value to angle (0-100 -> -π/2 to π/2)
    scaleValue(value) {
        return d3.scaleLinear()
            .domain([this.config.minValue, this.config.maxValue])
            .range([0, Math.PI])
            (value);
    }
    
    // Inverse scale to get value from angle
    inverseScaleValue(angle) {
        return d3.scaleLinear()
            .domain([0, Math.PI])
            .range([this.config.minValue, this.config.maxValue])
            (angle);
    }
    
    updateNeedle(value) {
        const angle = this.scaleValue(value) - Math.PI / 2;
        
        this.needleGroup.transition()
            .duration(this.config.transitionDuration)
            .attr("transform", `rotate(${angle * 180 / Math.PI})`);
    }
    
    getCurrentData() {
        return mockData[this.currentDataIndex];
    }
    
    update(data) {
        this.updateNeedle(data.value);
        this.updateStatusHighlight(data);
        this.updateValueDisplay(data.value);
    }
    
    updateValueDisplay(value) {
        // Update the center value display
        if (this.valueDisplay) {
            this.valueDisplay.text(value + "%");
        }
    }
    
    updateStatusHighlight(data) {
        // Determine actual status based on value for correct indicator positioning
        let actualStatus = "low";
        if (data.value >= 80) {
            actualStatus = "high";
        } else if (data.value >= 20) {
            actualStatus = "medium";
        }
        
        // Get the status color based on actual status
        const color = this.getStatusColor(actualStatus);
        
        // Update the status text and color
        const statusElement = document.getElementById("current-status");
        if (statusElement) {
            statusElement.textContent = actualStatus.charAt(0).toUpperCase() + actualStatus.slice(1);
            statusElement.style.backgroundColor = color;
        }
        
        // Update project and production line information
        const projectElement = document.getElementById("current-project");
        const lineElement = document.getElementById("current-line");
        
        if (projectElement && data.details.project) {
            projectElement.textContent = data.details.project;
        }
        
        if (lineElement && data.details.productionLine) {
            // Extract the line part without the project name
            const linePart = data.details.productionLine.replace(data.details.project + " ", "");
            lineElement.textContent = linePart;
        }
        
        // Update fun comment based on actual status
        const funCommentElement = document.getElementById("fun-comment");
        if (funCommentElement) {
            let emoji = "";
            let comment = "";
            
            switch (actualStatus.toLowerCase()) {
                case "low":
                    emoji = "😊";
                    comment = "All good!";
                    break;
                case "medium":
                    emoji = "🤔";
                    comment = "Let's improve this!";
                    break;
                case "high":
                    emoji = "😱";
                    comment = "Narii, 3ta9 3ta9!";
                    break;
                default:
                    emoji = "🔍";
                    comment = "Analyzing...";
            }
            
            funCommentElement.textContent = `${emoji} ${comment}`;
        }
        
        // Update metrics
        this.updateMetrics();
    }
    
    updateMetrics() {
        // Get top 5 production lines by highest defects
        const sortedLines = mockData
            .sort((a, b) => b.details.totalDefects - a.details.totalDefects)
            .slice(0, 5);
        
        // Update the DOM elements with top 5 lines
        const lowDefectsElement = document.getElementById("low-defects");
        const mediumDefectsElement = document.getElementById("medium-defects");
        const highDefectsElement = document.getElementById("high-defects");
        
        if (sortedLines.length >= 1) {
            lowDefectsElement.textContent = sortedLines[0].details.totalDefects;
            lowDefectsElement.parentElement.querySelector('.metric-title').textContent = `#1: ${sortedLines[0].details.productionLine}`;
        }
        
        if (sortedLines.length >= 2) {
            mediumDefectsElement.textContent = sortedLines[1].details.totalDefects;
            mediumDefectsElement.parentElement.querySelector('.metric-title').textContent = `#2: ${sortedLines[1].details.productionLine}`;
        }
        
        if (sortedLines.length >= 3) {
            highDefectsElement.textContent = sortedLines[2].details.totalDefects;
            highDefectsElement.parentElement.querySelector('.metric-title').textContent = `#3: ${sortedLines[2].details.productionLine}`;
        }
    }
    
    showTooltip(event, data) {
        // Format the tooltip content
        const formatContent = (data) => {
            // Determine actual status based on value
            let actualStatus = "low";
            if (data.value >= 80) {
                actualStatus = "high";
            } else if (data.value >= 20) {
                actualStatus = "medium";
            }
            
            let emoji = "";
            
            switch (actualStatus.toLowerCase()) {
                case "low":
                    emoji = "😊";
                    break;
                case "medium":
                    emoji = "🤔";
                    break;
                case "high":
                    emoji = "😱";
                    break;
                default:
                    emoji = "🔍";
            }
            
            return `
                <h3>Defect Status: <span style="color:${this.getStatusColor(actualStatus)}">${actualStatus.toUpperCase()}</span> ${emoji}</h3>
                <p><strong>Project:</strong> ${data.details.project}</p>
                <p><strong>Production Line:</strong> ${data.details.productionLine}</p>
                <p><strong>Shift:</strong> ${data.details.shiftInfo}</p>
                <p><strong>Date:</strong> ${data.details.date}</p>
                <p><strong>Defect Rate:</strong> ${data.details.defectRate}</p>
                <p><strong>Total Inspected:</strong> ${data.details.totalInspected}</p>
                <p><strong>Total Defects:</strong> ${data.details.totalDefects}</p>
                <p><strong>Major Defects:</strong> ${data.details.majorDefects}</p>
                <p><strong>Minor Defects:</strong> ${data.details.minorDefects}</p>
                <p><strong>Category:</strong> ${actualStatus.charAt(0).toUpperCase() + actualStatus.slice(1)}</p>
            `;
        };
        
        // Get tooltip dimensions for better positioning
        const tooltipWidth = 300; // From CSS
        const tooltipHeight = 200; // Approximate height
        const offset = 15;
        
        // Calculate position to keep tooltip on screen
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let left = event.clientX + offset;
        let top = event.clientY - offset;
        
        // Adjust if tooltip would go off screen
        if (left + tooltipWidth > windowWidth) {
            left = event.clientX - tooltipWidth - offset;
        }
        if (top - tooltipHeight < 0) {
            top = event.clientY + offset;
        }
        
        // Position and show tooltip
        this.tooltip
            .style("left", left + "px")
            .style("top", top + "px")
            .classed("visible", true);
        
        // Set content
        this.tooltipContent.html(formatContent(data));
        
        // Add mousemove listener to follow cursor
        this.followCursor = (e) => {
            let left = e.clientX + offset;
            let top = e.clientY - offset;
            
            // Adjust if tooltip would go off screen
            if (left + tooltipWidth > windowWidth) {
                left = e.clientX - tooltipWidth - offset;
            }
            if (top - tooltipHeight < 0) {
                top = e.clientY + offset;
            }
            
            this.tooltip
                .style("left", left + "px")
                .style("top", top + "px");
        };
        
        document.addEventListener("mousemove", this.followCursor);
    }
    
    hideTooltip() {
        this.tooltip.classed("visible", false);
        
        // Remove mousemove listener
        if (this.followCursor) {
            document.removeEventListener("mousemove", this.followCursor);
            this.followCursor = null;
        }
    }
    
    getStatusColor(status) {
        const threshold = this.config.thresholds.find(t => t.label.toLowerCase() === status.toLowerCase());
        return threshold ? threshold.color : "#333";
    }
    
    startAutoRotate() {
        if (this.autoRotateTimer) {
            clearInterval(this.autoRotateTimer);
        }
        
        this.autoRotateTimer = setInterval(() => {
            this.currentDataIndex = (this.currentDataIndex + 1) % mockData.length;
            this.update(this.getCurrentData());
        }, this.config.autoRotateInterval);
    }
    
    stopAutoRotate() {
        if (this.autoRotateTimer) {
            clearInterval(this.autoRotateTimer);
            this.autoRotateTimer = null;
        }
    }
    
    createValueIndicators() {
        // Remove previous indicators if any
        this.svg.selectAll('.gauge-tick, .gauge-tick-label, .gauge-status-label').remove();

        const tickCount = 11; // 0, 10, 20, ..., 100
        const tickLength = 15;
        const labelOffset = 25;
        const outerRadius = this.radius - this.config.arcInset;
        const innerRadius = this.radius - this.config.arcWidth - this.config.arcInset;

        // Create tick marks and labels at regular intervals
        for (let i = 0; i < tickCount; i++) {
            const value = this.config.minValue + (i * (this.config.maxValue - this.config.minValue) / (tickCount - 1));
            // Rotate the angle 90° counterclockwise to match the gauge orientation
            const angle = this.scaleValue(value) - Math.PI; // Changed from -Math.PI / 2 to -Math.PI
            
            // Calculate positions for tick marks (extending outward from the arc)
            const tickStartX = Math.cos(angle) * outerRadius;
            const tickStartY = Math.sin(angle) * outerRadius;
            const tickEndX = Math.cos(angle) * (outerRadius + tickLength);
            const tickEndY = Math.sin(angle) * (outerRadius + tickLength);
            
            // Draw tick mark
            this.svg.append('line')
                .attr('class', 'gauge-tick')
                .attr('x1', tickStartX)
                .attr('y1', tickStartY)
                .attr('x2', tickEndX)
                .attr('y2', tickEndY)
                .attr('stroke', '#333')
                .attr('stroke-width', 2);

            // Calculate label position (further out from tick end)
            const labelX = Math.cos(angle) * (outerRadius + tickLength + labelOffset);
            const labelY = Math.sin(angle) * (outerRadius + tickLength + labelOffset);

            // Draw label (keeping it horizontal - no rotation)
            this.svg.append('text')
                .attr('class', 'gauge-tick-label')
                .attr('x', labelX)
                .attr('y', labelY)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central')
                .attr('font-size', '12px')
                .attr('font-weight', 'bold')
                .attr('fill', '#333')
                .text(Math.round(value) + '%');
        }

        // Add status labels positioned on the arc segments
        this.config.thresholds.forEach((threshold, index) => {
            // Calculate the middle angle of each threshold segment
            let segmentStartValue = threshold.value;
            let segmentEndValue = index < this.config.thresholds.length - 1 
                ? this.config.thresholds[index + 1].value 
                : this.config.maxValue;
            
            const middleValue = (segmentStartValue + segmentEndValue) / 2;
            // Rotate the angle 90° counterclockwise for status labels too
            const angle = this.scaleValue(middleValue) - Math.PI; // Changed from -Math.PI / 2 to -Math.PI
            
            // Position label on the arc itself
            const arcMiddleRadius = (outerRadius + innerRadius) / 2;
            const labelX = Math.cos(angle) * arcMiddleRadius;
            const labelY = Math.sin(angle) * arcMiddleRadius;
            
            this.svg.append("text")
                .attr("class", "gauge-status-label")
                .attr("x", labelX)
                .attr("y", labelY)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("font-size", "14px")
                .attr("font-weight", "bold")
                .attr("fill", "white")
                .style("text-shadow", "2px 2px 4px rgba(0, 0, 0, 0.8)")
                .text(threshold.label.toUpperCase());
        });
    }
}

// Function to wait for D3.js to load
function waitForD3(callback, timeout = 5000) {
    const startTime = Date.now();
    
    function checkD3() {
        if (typeof d3 !== 'undefined') {
            callback();
        } else if (Date.now() - startTime > timeout) {
            console.error('D3.js failed to load within timeout period');
            // Show fallback error message
            const gaugeContainer = document.getElementById('gauge');
            if (gaugeContainer) {
                gaugeContainer.innerHTML = `
                    <div style="text-align: center; padding: 50px; color: #e74c3c;">
                        <h3>⚠️ Library Loading Error</h3>
                        <p>D3.js visualization library failed to load.</p>
                        <p style="font-size: 14px; opacity: 0.8;">Please check your internet connection and refresh the page.</p>
                        <button onclick="window.location.reload()" style="
                            margin-top: 15px;
                            padding: 10px 20px;
                            background: #3182ce;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                        ">🔄 Refresh Page</button>
                    </div>
                `;
            }
        } else {
            // Wait a bit and try again
            setTimeout(checkD3, 50);
        }
    }
    
    checkD3();
}

// Function to initialize the application
function initializeApp() {
    try {
        // Check if required elements exist
        const gaugeContainer = document.getElementById('gauge');
        if (!gaugeContainer) {
            console.error('Gauge container element not found');
            return;
        }
        
        // Create gauge instance
        const gauge = new DefectGauge("#gauge", config);
        
        // Show initial data
        gauge.update(gauge.getCurrentData());
        
        // Update metrics initially
        gauge.updateMetrics();
        
        // Start auto-rotation
        gauge.startAutoRotate();
        
        // Add navigation functionality
        const qrqcBtn = document.getElementById("qrqc-btn");
        if (qrqcBtn) {
            qrqcBtn.addEventListener("click", function() {
                window.location.href = "Analysis/qrqc.html";
            });
        }
        
        const vigilanceBtn = document.getElementById("vigilance-btn");
        if (vigilanceBtn) {
            vigilanceBtn.addEventListener("click", function() {
                window.location.href = "Vigilance_test/vigilance-test.html";
            });
        }
        
        const dashboardBtn = document.getElementById("dashboard-btn");
        if (dashboardBtn) {
            dashboardBtn.addEventListener("click", function() {
                window.location.href = "graphs/dashboard.html";
            });
        }
        
        const adminBtn = document.getElementById("admin-btn");
        if (adminBtn) {
            adminBtn.addEventListener("click", function() {
                window.location.href = "Admin/admin.html";
            });
        }
        
        const fiveSBtn = document.getElementById("5s-btn");
        if (fiveSBtn) {
            fiveSBtn.addEventListener("click", function() {
                window.location.href = "5S/5s-checklist.html";
            });
        }
        
        const afpBtn = document.getElementById("afp-btn");
        if (afpBtn) {
            afpBtn.addEventListener("click", function() {
                window.location.href = "AFP/afp-audit.html";
            });
        }
        
        const diagramsBtn = document.getElementById("diagrams-btn");
        if (diagramsBtn) {
            diagramsBtn.addEventListener("click", function() {
                window.location.href = "Diagrams/LEONI_QMS_FLOWCHART.html";
            });
        }
        
        console.log('LEONI QMS Gauge initialized successfully');
        
    } catch (error) {
        console.error('Error initializing LEONI QMS Gauge:', error);
        
        // Show user-friendly error message
        const gaugeContainer = document.getElementById('gauge');
        if (gaugeContainer) {
            gaugeContainer.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #e74c3c;">
                    <h3>⚠️ Loading Error</h3>
                    <p>Unable to initialize the gauge visualization.</p>
                    <p style="font-size: 14px; opacity: 0.8;">Please refresh the page or contact support.</p>
                    <button onclick="window.location.reload()" style="
                        margin-top: 15px;
                        padding: 10px 20px;
                        background: #3182ce;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    ">🔄 Refresh Page</button>
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded and D3.js is available
document.addEventListener("DOMContentLoaded", function() {
    waitForD3(initializeApp);
});
