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
        defectRate: {
            value: Math.floor(Math.random() * 10) + 8, // 8-18 PPM
            target: 15,
            trend: "down",
            trendValue: -2.3
        },
        firstPassYield: {
            value: (Math.random() * 3 + 97).toFixed(1), // 97-100%
            target: 98.5,
            trend: "up",
            trendValue: 1.2
        },
        rightFirstTime: {
            value: (Math.random() * 4 + 95).toFixed(1), // 95-99%
            target: 96.0,
            trend: "stable",
            trendValue: 0.1
        },
        reworkRate: {
            value: (Math.random() * 2 + 1).toFixed(1), // 1-3%
            target: 2.5,
            trend: "down",
            trendValue: -0.8
        },
        processCapability: {
            value: (Math.random() * 0.3 + 1.5).toFixed(2), // 1.5-1.8 Cpk
            target: 1.33,
            trend: "up",
            trendValue: 0.05
        },
        customerComplaints: {
            value: Math.floor(Math.random() * 3) + 2, // 2-5 PPM
            target: 5,
            trend: "down",
            trendValue: -1
        },
        audit5S: {
            value: Math.floor(Math.random() * 8) + 92, // 92-100%
            target: 95,
            trend: "up",
            trendValue: 2
        },
        auditAFP: {
            value: Math.floor(Math.random() * 6) + 94, // 94-100%
            target: 95,
            trend: "stable",
            trendValue: -0.5
        },
        lineEfficiency: {
            value: (Math.random() * 5 + 93).toFixed(1), // 93-98%
            target: 95,
            trend: "up",
            trendValue: 1.8
        },
        scrapRate: {
            value: (Math.random() * 1.5 + 0.5).toFixed(1), // 0.5-2.0%
            target: 1.5,
            trend: "down",
            trendValue: -0.3
        }
    },

    // Top 5 Defects for VCE Line (Cable Engine specific)
    topDefects: [
        {
            name: "Wire Insulation Damage",
            count: Math.floor(Math.random() * 15) + 12,
            severity: "high",
            ppm: Math.floor(Math.random() * 8) + 5,
            description: "Insulation cuts or abrasions on wire harness"
        },
        {
            name: "Connector Misalignment",
            count: Math.floor(Math.random() * 12) + 8,
            severity: "medium",
            ppm: Math.floor(Math.random() * 6) + 3,
            description: "Electrical connectors not properly seated"
        },
        {
            name: "Crimp Quality Issue",
            count: Math.floor(Math.random() * 10) + 6,
            severity: "high",
            ppm: Math.floor(Math.random() * 5) + 2,
            description: "Improper crimp force or positioning"
        },
        {
            name: "Tape Wrapping Defect",
            count: Math.floor(Math.random() * 8) + 4,
            severity: "low",
            ppm: Math.floor(Math.random() * 4) + 1,
            description: "Inadequate or excessive tape wrapping"
        },
        {
            name: "Length Tolerance Issue",
            count: Math.floor(Math.random() * 6) + 3,
            severity: "medium",
            ppm: Math.floor(Math.random() * 3) + 1,
            description: "Cable length outside specified tolerance"
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
        rightFirstTime: [95.1, 96.2, 94.8, 96.5, 97.1, 97.8, 96.9],
        efficiency: [92.3, 93.8, 94.2, 93.5, 94.8, 95.2, 94.6]
    },

    // Color schemes for charts
    colorSchemes: {
        defects: [
            '#ef4444', // Red for high severity
            '#f59e0b', // Orange for medium severity
            '#10b981', // Green for low severity
            '#3b82f6', // Blue for info
            '#8b5cf6'  // Purple for other
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
        rightFirstTime: { excellent: 96, good: 93, warning: 88 },
        reworkRate: { excellent: 2, good: 4, warning: 6 },
        processCapability: { excellent: 1.67, good: 1.33, warning: 1.0 },
        customerComplaints: { excellent: 3, good: 5, warning: 10 },
        audit5S: { excellent: 95, good: 90, warning: 85 },
        auditAFP: { excellent: 95, good: 90, warning: 85 },
        lineEfficiency: { excellent: 95, good: 90, warning: 85 },
        scrapRate: { excellent: 1, good: 2, warning: 3 }
    },

    // Status calculation helper
    getKPIStatus: function(kpiName, value) {
        const targets = this.targets[kpiName];
        if (!targets) return 'good';
        
        // For metrics where lower is better (defects, rework, complaints, scrap)
        const lowerIsBetter = ['defectRate', 'reworkRate', 'customerComplaints', 'scrapRate'];
        
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
