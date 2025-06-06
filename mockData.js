// Mock data for LEONI wiring systems production line defect status
const mockData = [
    {
        id: 1,
        status: "low",
        value: 15, // percentage of defects (low: 0-25)
        details: {
            totalInspected: 500,
            totalDefects: 75,
            defectRate: "15%",
            majorDefects: 20,
            minorDefects: 55,
            productionLine: "VOLVO MDEP",
            project: "VOLVO",
            shiftInfo: "Morning Shift",
            date: "2025-06-05"
        }
    },
    {
        id: 2,
        status: "medium",
        value: 35, // percentage of defects (medium: 26-50)
        details: {
            totalInspected: 450,
            totalDefects: 158,
            defectRate: "35%",
            majorDefects: 95,
            minorDefects: 63,
            productionLine: "VOLVO HDEP C1",
            project: "VOLVO",
            shiftInfo: "Afternoon Shift",
            date: "2025-06-05"
        }
    },
    {
        id: 3,
        status: "high",
        value: 86, // percentage of defects (high: 51-100)
        details: {
            totalInspected: 350,
            totalDefects: 238,
            defectRate: "86%",
            majorDefects: 178,
            minorDefects: 60,
            productionLine: "VOLVO HDEP C2",
            project: "VOLVO",
            shiftInfo: "Night Shift",
            date: "2025-06-05"
        }
    },
    {
        id: 4,
        status: "low",
        value: 8, // percentage of defects (low: 0-25)
        details: {
            totalInspected: 600,
            totalDefects: 48,
            defectRate: "8%",
            majorDefects: 15,
            minorDefects: 33,
            productionLine: "VOLVO HDEP C3",
            project: "VOLVO",
            shiftInfo: "Morning Shift",
            date: "2025-06-05"
        }
    },
    {
        id: 5,
        status: "medium",
        value: 42, // percentage of defects (medium: 26-50)
        details: {
            totalInspected: 520,
            totalDefects: 218,
            defectRate: "42%",
            majorDefects: 130,
            minorDefects: 88,
            productionLine: "VOLVO VCE",
            project: "VOLVO",
            shiftInfo: "Afternoon Shift",
            date: "2025-06-05"
        }
    }
];
