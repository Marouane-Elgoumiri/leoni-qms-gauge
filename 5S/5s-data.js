// 5S Checklist Data - 41 Criteria organized by categories
const fiveSCriteria = {
    seiri: [
        "Work area is free of unnecessary items and materials",
        "Only essential tools and equipment are present in the workspace",
        "Obsolete or broken items have been removed",
        "Red tag system is implemented for questionable items",
        "Storage areas contain only necessary inventory",
        "Personal items are stored in designated areas only",
        "Unnecessary paperwork and documents have been removed",
        "Work surfaces are clear of non-essential items",
        "Emergency exits and pathways are clear of obstacles"
    ],
    seiton: [
        "Everything has a designated place and is in its place",
        "Tools and equipment are easily accessible when needed",
        "Items are stored according to frequency of use",
        "Visual management systems are in place (labels, color coding)",
        "Height and ergonomic considerations are applied to storage",
        "Heavy items are stored at appropriate levels",
        "Storage locations are clearly marked and visible",
        "First aid kits and safety equipment are properly located",
        "Work instructions and procedures are readily available"
    ],
    seiso: [
        "Work area is clean and free of dirt, dust, and debris",
        "Equipment and machinery are clean and well-maintained",
        "Floors are clean, dry, and free of spills",
        "Waste containers are emptied regularly and clean",
        "Cleaning supplies are available and properly stored",
        "Light fixtures are clean and provide adequate illumination",
        "Windows and glass surfaces are clean",
        "Ventilation systems are clean and functioning properly",
        "Restrooms and break areas are clean and well-maintained"
    ],
    seiketsu: [
        "Cleaning schedules are established and followed",
        "Responsibility for cleanliness is clearly assigned",
        "Standard operating procedures for 5S are documented",
        "Regular inspections and audits are conducted",
        "Visual controls are maintained and updated",
        "Training on 5S principles is provided to all staff",
        "Improvement suggestions are encouraged and implemented",
        "5S standards are consistently applied across all shifts",
        "Preventive maintenance schedules are followed"
    ],
    shitsuke: [
        "5S practices are performed daily without supervision",
        "Staff demonstrate commitment to maintaining standards",
        "5S activities are integrated into daily routines",
        "Regular team meetings discuss 5S progress and issues",
        "Management supports and participates in 5S activities",
        "Recognition and rewards are given for 5S achievements",
        "Continuous improvement mindset is evident",
        "New employees are properly trained in 5S practices",
        "5S metrics are tracked and displayed visibly"
    ]
};

// Weekly scores storage
let weeklyScores = {
    monday: {},
    tuesday: {},
    wednesday: {},
    thursday: {},
    friday: {},
    saturday: {}
};

// Initialize empty scores for all criteria and days
Object.keys(weeklyScores).forEach(day => {
    weeklyScores[day] = {};
    Object.keys(fiveSCriteria).forEach(category => {
        weeklyScores[day][category] = {};
        fiveSCriteria[category].forEach((criterion, index) => {
            weeklyScores[day][category][index] = null; // null = not assessed, 'ok', 'not-ok', 'na'
        });
    });
});

// Category information
const categoryInfo = {
    seiri: {
        name: "Seiri (Sort)",
        description: "Eliminate unnecessary items from the workplace",
        icon: "🗂️",
        color: "#e53e3e"
    },
    seiton: {
        name: "Seiton (Set in Order)",
        description: "Organize and arrange necessary items efficiently",
        icon: "📋",
        color: "#dd6b20"
    },
    seiso: {
        name: "Seiso (Shine)",
        description: "Clean and maintain the workplace",
        icon: "✨",
        color: "#3182ce"
    },
    seiketsu: {
        name: "Seiketsu (Standardize)",
        description: "Establish standards and procedures",
        icon: "📏",
        color: "#38a169"
    },
    shitsuke: {
        name: "Shitsuke (Sustain)",
        description: "Maintain and improve the 5S system",
        icon: "🎯",
        color: "#805ad5"
    }
};

// Sample historical data for the chart
const historicalData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current Week'],
    datasets: [
        {
            label: 'Monday',
            data: [85, 88, 92, 89, 91],
            borderColor: '#e53e3e',
            backgroundColor: 'rgba(229, 62, 62, 0.1)',
            tension: 0.4
        },
        {
            label: 'Tuesday',
            data: [87, 89, 91, 88, 93],
            borderColor: '#dd6b20',
            backgroundColor: 'rgba(221, 107, 32, 0.1)',
            tension: 0.4
        },
        {
            label: 'Wednesday',
            data: [89, 91, 93, 90, 94],
            borderColor: '#3182ce',
            backgroundColor: 'rgba(49, 130, 206, 0.1)',
            tension: 0.4
        },
        {
            label: 'Thursday',
            data: [88, 90, 92, 91, 92],
            borderColor: '#38a169',
            backgroundColor: 'rgba(56, 161, 105, 0.1)',
            tension: 0.4
        },
        {
            label: 'Friday',
            data: [86, 88, 90, 89, 90],
            borderColor: '#805ad5',
            backgroundColor: 'rgba(128, 90, 213, 0.1)',
            tension: 0.4
        },
        {
            label: 'Saturday',
            data: [84, 86, 88, 87, 88],
            borderColor: '#718096',
            backgroundColor: 'rgba(113, 128, 150, 0.1)',
            tension: 0.4
        }
    ]
};
