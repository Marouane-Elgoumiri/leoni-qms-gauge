// Mock data for LEONI Quality Dashboard
const mockData = {
    // Current defects count (random between 15-45)
    totalDefects: Math.floor(Math.random() * 31) + 15,
    
    // Quality scores (random between 95-100)
    qualityScores: {
        score5S: Math.floor(Math.random() * 6) + 95,
        scoreAFP: Math.floor(Math.random() * 6) + 95
    },
    
    // KPI data for production lines
    kpiData: [
        {
            label: "Efficiency",
            value: (Math.random() * 10 + 85).toFixed(1) + "%",
            trend: "up"
        },
        {
            label: "RFT", // Line 2 Efficiency replaced by RFT
            value: (Math.random() * 5 + 93).toFixed(1) + "%",
            trend: "up"
        },
        {
            label: "Overall OEE",
            value: (Math.random() * 10 + 80).toFixed(1) + "%",
            trend: "stable"
        },
        {
            label: "PPM", // Yield Rate replaced by PPM
            value: (Math.floor(Math.random() * 10) + 8) + " PPM",
            trend: "down"
        },
        {
            label: "Customer Complaints", // Downtime replaced by Customer Complaints
            value: (Math.floor(Math.random() * 2) + 1) + "/" + (Math.floor(Math.random() * 10) + 5),
            trend: "down"
        },
        {
            label: "Scrap Rate",
            value: (Math.random() * 3 + 2).toFixed(2) + "%",
            trend: "down"
        }
    ],
    
    // Top 5 defects data
    topDefects: [
        {
            name: "Wire Insulation Defect",
            count: Math.floor(Math.random() * 20) + 25,
            severity: "high",
            trend: "increasing"
        },
        {
            name: "Connector Misalignment",
            count: Math.floor(Math.random() * 15) + 18,
            severity: "medium",
            trend: "stable"
        },
        {
            name: "Crimp Quality Issue",
            count: Math.floor(Math.random() * 12) + 15,
            severity: "high",
            trend: "decreasing"
        },
        {
            name: "Cable Length Variation",
            count: Math.floor(Math.random() * 10) + 12,
            severity: "low",
            trend: "stable"
        },
        {
            name: "Terminal Insertion",
            count: Math.floor(Math.random() * 8) + 8,
            severity: "medium",
            trend: "decreasing"
        }
    ],
    
    // Top 5 production lines with defects
    topLines: [
        {
            name: "VCE",
            defectCount: Math.floor(Math.random() * 15) + 20,
            efficiency: (Math.random() * 10 + 85).toFixed(1),
            status: "attention"
        },
        {
            name: "HDEP C1",
            defectCount: Math.floor(Math.random() * 12) + 16,
            efficiency: (Math.random() * 10 + 85).toFixed(1),
            status: "normal"
        },
        {
            name: "MDEP",
            defectCount: Math.floor(Math.random() * 10) + 14,
            efficiency: (Math.random() * 10 + 85).toFixed(1),
            status: "good"
        },
        {
            name: "Small",
            defectCount: Math.floor(Math.random() * 8) + 11,
            efficiency: (Math.random() * 10 + 85).toFixed(1),
            status: "good"
        },
        {
            name: "HDEP C2",
            defectCount: Math.floor(Math.random() * 6) + 8,
            efficiency: (Math.random() * 10 + 85).toFixed(1),
            status: "excellent"
        }
    ],
    
    // Additional metadata
    lastUpdated: new Date().toLocaleString(),
    refreshInterval: 30000, // 30 seconds
    
    // Color schemes for charts
    colorSchemes: {
        defects: [
            '#FF6B6B', // Red
            '#4ECDC4', // Teal
            '#45B7D1', // Blue
            '#FFA07A', // Light Salmon
            '#98D8C8'  // Mint
        ],
        lines: [
            '#6C5CE7', // Purple
            '#A29BFE', // Light Purple
            '#FD79A8', // Pink
            '#FDCB6E', // Yellow
            '#6C5CE7'  // Purple
        ]
    }
};

// Function to refresh data (simulate real-time updates)
function refreshMockData() {
    mockData.totalDefects = Math.floor(Math.random() * 31) + 15;
    mockData.qualityScores.score5S = Math.floor(Math.random() * 6) + 95;
    mockData.qualityScores.scoreAFP = Math.floor(Math.random() * 6) + 95;
    
    // Update defect counts
    mockData.topDefects.forEach(defect => {
        defect.count = Math.floor(Math.random() * 20) + 10;
    });
    
    // Update line defect counts
    mockData.topLines.forEach(line => {
        line.defectCount = Math.floor(Math.random() * 15) + 8;
        line.efficiency = (Math.random() * 10 + 85).toFixed(1);
    });
    
    mockData.lastUpdated = new Date().toLocaleString();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mockData;
}
