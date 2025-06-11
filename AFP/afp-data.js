// AFP Audit Data Structure - 56 checkpoints across 3 categories
const AFP_AUDIT_DATA = {
    categories: [
        {
            id: 'visual',
            name: 'Visual Control',
            emoji: '👁️',
            color: '#0ea5e9',
            description: 'Visual inspection and control points',
            checkpoints: [
                { id: 'v01', text: 'Workspace cleanliness and organization' },
                { id: 'v02', text: 'Tool placement and identification' },
                { id: 'v03', text: 'Product identification labels' },
                { id: 'v04', text: 'Visual management boards updated' },
                { id: 'v05', text: 'Safety equipment visible and accessible' },
                { id: 'v06', text: 'Work instructions displayed and current' },
                { id: 'v07', text: 'Quality standards posted' },
                { id: 'v08', text: 'Non-conforming product segregation' },
                { id: 'v09', text: 'Component inventory levels marked' },
                { id: 'v10', text: 'Operator certification displayed' },
                { id: 'v11', text: 'Environmental conditions monitoring' },
                { id: 'v12', text: 'Emergency procedures visible' },
                { id: 'v13', text: 'Maintenance schedule displayed' },
                { id: 'v14', text: 'Quality alerts and notifications' },
                { id: 'v15', text: 'Traceability documentation visible' }
            ]
        },
        {
            id: 'electric',
            name: 'Electric Control',
            emoji: '⚡',
            color: '#f59e0b',
            description: 'Electrical testing and control procedures',
            checkpoints: [
                { id: 'e01', text: 'Continuity test equipment calibration' },
                { id: 'e02', text: 'Insulation resistance testing' },
                { id: 'e03', text: 'Wire gauge verification' },
                { id: 'e04', text: 'Connection torque specifications' },
                { id: 'e05', text: 'Terminal crimping quality' },
                { id: 'e06', text: 'Connector sealing integrity' },
                { id: 'e07', text: 'Cable routing compliance' },
                { id: 'e08', text: 'Grounding verification' },
                { id: 'e09', text: 'Voltage drop testing' },
                { id: 'e10', text: 'Signal integrity verification' },
                { id: 'e11', text: 'EMC compliance testing' },
                { id: 'e12', text: 'Temperature cycling test' },
                { id: 'e13', text: 'Vibration test compliance' },
                { id: 'e14', text: 'Pull force testing' },
                { id: 'e15', text: 'Bend radius verification' },
                { id: 'e16', text: 'Shielding effectiveness' },
                { id: 'e17', text: 'Contact resistance measurement' },
                { id: 'e18', text: 'Dielectric strength testing' },
                { id: 'e19', text: 'Environmental sealing' },
                { id: 'e20', text: 'Connector mating force' },
                { id: 'e21', text: 'Wire color coding verification' },
                { id: 'e22', text: 'Circuit protection testing' },
                { id: 'e23', text: 'Load current verification' },
                { id: 'e24', text: 'Short circuit protection' },
                { id: 'e25', text: 'Ground fault detection' },
                { id: 'e26', text: 'Polarity verification' },
                { id: 'e27', text: 'High voltage testing' },
                { id: 'e28', text: 'Functional testing' },
                { id: 'e29', text: 'Performance parameter validation' },
                { id: 'e30', text: 'Automated test equipment status' },
                { id: 'e31', text: 'Test data recording accuracy' },
                { id: 'e32', text: 'Calibration certificate validity' },
                { id: 'e33', text: 'Test sequence compliance' },
                { id: 'e34', text: 'Measurement uncertainty evaluation' },
                { id: 'e35', text: 'Test environment conditions' },
                { id: 'e36', text: 'Equipment maintenance status' },
                { id: 'e37', text: 'Safety interlock verification' },
                { id: 'e38', text: 'Test result documentation' }
            ]
        },
        {
            id: 'conformity',
            name: 'Product Conformity',
            emoji: '✅',
            color: '#22c55e',
            description: 'Final product conformity verification',
            checkpoints: [
                { id: 'c01', text: 'Final product specification compliance' },
                { id: 'c02', text: 'Customer requirements verification' }
            ]
        }
    ]
};

// Sample audit data for demonstration
const SAMPLE_AUDIT_DATA = {
    documentInfo: {
        date: '2025-06-11',
        auditor: 'Sarah Martinez',
        sector: 'VOLVO MDEP Production Line 3',
        vehicleFamily: 'VOLVO XC90 - Premium Harness Assembly'
    },
    results: {
        'v01': { correct: true, nonCorrect: false, details: '' },
        'v02': { correct: false, nonCorrect: true, details: 'Tools not properly organized on workbench 2' },
        'v03': { correct: true, nonCorrect: false, details: '' },
        'v04': { correct: true, nonCorrect: false, details: '' },
        'v05': { correct: false, nonCorrect: true, details: 'Safety glasses missing at station 4' },
        'e01': { correct: true, nonCorrect: false, details: '' },
        'e02': { correct: false, nonCorrect: true, details: 'Equipment needs recalibration - due 2025-06-15' },
        'e15': { correct: true, nonCorrect: false, details: '' },
        'c01': { correct: true, nonCorrect: false, details: '' },
        'c02': { correct: true, nonCorrect: false, details: '' }
    }
};

// Historical audit data for trends
const HISTORICAL_AUDIT_DATA = [
    {
        date: '2025-06-10',
        auditor: 'Jean Dubois',
        sector: 'VOLVO HDEP C1',
        totalScore: 87,
        visualScore: 85,
        electricScore: 89,
        conformityScore: 90
    },
    {
        date: '2025-06-09',
        auditor: 'Maria Lopez',
        sector: 'VOLVO VCE',
        totalScore: 92,
        visualScore: 90,
        electricScore: 93,
        conformityScore: 95
    },
    {
        date: '2025-06-08',
        auditor: 'Omar Hassan',
        sector: 'VOLVO MDEP',
        totalScore: 78,
        visualScore: 75,
        electricScore: 80,
        conformityScore: 85
    },
    {
        date: '2025-06-07',
        auditor: 'Sarah Martinez',
        sector: 'VOLVO HDEP C1',
        totalScore: 94,
        visualScore: 95,
        electricScore: 93,
        conformityScore: 100
    },
    {
        date: '2025-06-06',
        auditor: 'Ahmed Ben Ali',
        sector: 'VOLVO VCE',
        totalScore: 89,
        visualScore: 88,
        electricScore: 90,
        conformityScore: 90
    }
];

// Predefined options for form fields
const FORM_OPTIONS = {
    auditors: [
        'Sarah Martinez',
        'Jean Dubois', 
        'Maria Lopez',
        'Omar Hassan',
        'Ahmed Ben Ali',
        'Lisa Anderson',
        'Mohamed Khadri'
    ],
    sectors: [
        'VOLVO MDEP Production Line 1',
        'VOLVO MDEP Production Line 2', 
        'VOLVO MDEP Production Line 3',
        'VOLVO HDEP C1 Assembly',
        'VOLVO VCE Manufacturing',
        'BMW Series Assembly',
        'AUDI Premium Line'
    ],
    vehicleFamilies: [
        'VOLVO XC90 - Premium Harness Assembly',
        'VOLVO XC60 - Standard Harness',
        'VOLVO S90 - Luxury Wire Harness',
        'BMW X5 - Performance Wiring',
        'BMW 3 Series - Standard Assembly',
        'AUDI Q7 - Premium Electronics',
        'AUDI A4 - Standard Harness'
    ]
};

// Export data for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AFP_AUDIT_DATA,
        SAMPLE_AUDIT_DATA,
        HISTORICAL_AUDIT_DATA,
        FORM_OPTIONS
    };
}
