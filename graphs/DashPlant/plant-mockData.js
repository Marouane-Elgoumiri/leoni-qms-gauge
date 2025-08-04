// VCE Production Line Mock Data - LEONI Quality System
const vceData = {
    // Production Line Information
    lineInfo: {
        name: "VCE",
        fullName: "VOLVO Cable Engine",
        shift: "A",
        operator: "Jean Martin",
        supervisor: "Marie Dubois",
        startTime: "06:00",
        targetProduction: 450
    },

    // Real-time Quality KPIs
    qualityKPIs: {
        defectCount: {
            value: 195,
            target: 237,
        },
        rftRate: {
            value: 99.74,
            target: 99.7,
        },
        reworkRate: {
            value: 0.26,
            target: 2,
        },
        customerComplaints: {
            value: 1,
            target: 5,
        },
        audit5S: {
            value: 96,
            target: 97,
        },
        auditAFP: {
            value: 92,
            target: 95,
        },
        lineEfficiency: {
            value: 70.7,
            target: 85,
        },
        scrapWeight: {
            totalKg: 67.73,
            perHourKg: 1.20,
            unit: "kg",
            target: 0,
        },
        externalPPM: {
            value: 10,
            target: 62,
        },
        internalPPM: {
            value: 1918,
            target: 3156,
        }
    },

    // Top Defects for Plant (Total: 195) - Ordered by count (highest to lowest)
    topDefects: [
        {
            name: "Switched wire",
            count: 169,
            severity: "low",
            ppm: null,
            description: "Switched wire detected"
        },
        {
            name: "Short branch",
            count: 8,
            severity: "medium",
            ppm: null,
            description: "Short branch detected"
        },
        {
            name: "Damaged component",
            count: 6,
            severity: "medium",
            ppm: null,
            description: "Damaged component detected"
        },
        {
            name: "Wrong Component",
            count: 6,
            severity: "medium",
            ppm: null,
            description: "Component error detected"
        },
        {
            name: "Unlocked terminal",
            count: 3,
            severity: "medium",
            ppm: null,
            description: "Not locked detected"
        },
        {
            name: "Oversized witness",
            count: 1,
            severity: "low",
            ppm: null,
            description: "Long branch detected"
        },
        {
            name: "Misoriented branch",
            count: 1,
            severity: "medium",
            ppm: null,
            description: "Branch wrongly oriented"
        },
        {
            name: "Exaggerated indicator",
            count: 1,
            severity: "medium",
            ppm: null,
            description: "Exaggerated indicator detected"
        }
    ],

    // VOLVO Production Lines Comparison Data
    volvoLines: [
        {
            name: "VCE",
            fullName: "VOLVO Cable Engine",
            defects: Math.floor(Math.random() * 10) + 8, // Current line
            efficiency: Math.floor(Math.random() * 5) + 93,
            qualityScore: Math.floor(Math.random() * 4) + 96,
            isCurrentLine: true
        },
        {
            name: "MDEP",
            fullName: "Motor Diesel Engine Production",
            defects: Math.floor(Math.random() * 15) + 10,
            efficiency: Math.floor(Math.random() * 6) + 90,
            qualityScore: Math.floor(Math.random() * 5) + 94
        },
        {
            name: "HDEP",
            fullName: "Heavy Duty Engine Production",
            defects: Math.floor(Math.random() * 20) + 15,
            efficiency: Math.floor(Math.random() * 7) + 88,
            qualityScore: Math.floor(Math.random() * 6) + 92
        },
        {
            name: "VEC",
            fullName: "VOLVO Engine Control",
            defects: Math.floor(Math.random() * 12) + 7,
            efficiency: Math.floor(Math.random() * 4) + 94,
            qualityScore: Math.floor(Math.random() * 3) + 97
        },
        {
            name: "VTC",
            fullName: "VOLVO Transmission Control",
            defects: Math.floor(Math.random() * 18) + 12,
            efficiency: Math.floor(Math.random() * 8) + 87,
            qualityScore: Math.floor(Math.random() * 7) + 91
        }
    ],

    // Historical trend data (last 7 days)
    trendData: {
        defectRate: [15, 12, 18, 14, 10, 8, 11],
        firstPassYield: [97.2, 98.1, 96.8, 97.9, 98.5, 98.8, 98.2],
        defectCount: [35, 28, 42, 31, 25, 22, 29],
        efficiency: [92.3, 93.8, 94.2, 93.5, 94.8, 95.2, 94.6]
    },

    // Color schemes for charts
    colorSchemes: {
        defects: [
            '#ef4444', // Inversion (red - highest count)
            '#f59e0b', // Branche courte (orange)
            '#10b981', // Composant endommagé (green)
            '#3b82f6', // Erreur composant (blue)
            '#8b5cf6', // Non verrouillé (purple)
            '#ec4899', // Branche longue (pink)
            '#06b6d4', // Branche mal orienté (cyan)
            '#84cc16'  // Témoin exagéré (lime)
        ],
        lines: [
            '#1f77b4', // VCE (current line - blue)
            '#ff7f0e', // MDEP (orange)
            '#2ca02c', // HDEP (green)
            '#d62728', // VEC (red)
            '#9467bd'  // VTC (purple)
        ],
        kpiStatus: {
            excellent: '#10b981', // Green
            good: '#3b82f6',      // Blue
            warning: '#f59e0b',   // Orange
            critical: '#ef4444'   // Red
        }
    },

    // Targets and thresholds
    targets: {
        defectRate: { excellent: 10, good: 15, warning: 25 },
        firstPassYield: { excellent: 98, good: 95, warning: 90 },
        defectCount: { excellent: 20, good: 30, warning: 45 },
        reworkStatus: { excellent: 5, good: 10, warning: 15 }, // Total harnesses with defects
        processCapability: { excellent: 1.67, good: 1.33, warning: 1.0 },
        customerComplaints: { excellent: 3, good: 5, warning: 10 },
        audit5S: { excellent: 95, good: 90, warning: 85 },
        auditAFP: { excellent: 95, good: 90, warning: 85 },
        lineEfficiency: { excellent: 95, good: 90, warning: 85 },
        scrapWeight: { excellent: 30, good: 50, warning: 70 } // grams
    },

    // Status calculation helper
    getKPIStatus: function(kpiName, value) {
        const targets = this.targets[kpiName];
        if (!targets) return 'good';
        
        // For metrics where lower is better (defects, rework, complaints, scrap)
        const lowerIsBetter = ['defectRate', 'defectCount', 'reworkStatus', 'customerComplaints', 'scrapWeight'];
        
        if (lowerIsBetter.includes(kpiName)) {
            if (value <= targets.excellent) return 'excellent';
            if (value <= targets.good) return 'good';
            if (value <= targets.warning) return 'warning';
            return 'critical';
        } else {
            // For metrics where higher is better
            if (value >= targets.excellent) return 'excellent';
            if (value >= targets.good) return 'good';
            if (value >= targets.warning) return 'warning';
            return 'critical';
        }
    },

    // Generate random variation for real-time updates
    generateVariation: function() {
        // Add small random variations to simulate real-time data
        Object.keys(this.qualityKPIs).forEach(kpi => {
            const current = this.qualityKPIs[kpi].value;
            const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
            
            if (typeof current === 'string') {
                const numValue = parseFloat(current);
                this.qualityKPIs[kpi].value = Math.max(0, numValue + variation).toFixed(1);
            } else {
                this.qualityKPIs[kpi].value = Math.max(0, Math.floor(current + variation));
            }
        });
    }
};

// Export for global use
window.vceData = vceData;
