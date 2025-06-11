// Mock data for LEONI Admin - Staff Management System

const mockData = {
    roles: [
        'AQL (Quality Line Agent)',
        'Quality Technician',
        'Team Leader'
    ],
    
    projects: [
        'Volvo',
        'JCB', 
        'MAN',
        'IVECO',
        'John Deere'
    ],
    
    productionLines: [
        'MDEP',
        'VCE',
        'HAULER',
        'HDEP C1',
        'HDEP C2',
        'HDEP C3'
    ],
    
    staff: [
        {
            id: 1,
            fullName: 'Ahmed Ben Salah',
            role: 'AQL (Quality Line Agent)',
            project: 'Volvo',
            productionLines: ['MDEP', 'VCE'],
            email: 'ahmed.bensalah@leoni.com',
            phone: '+216 98 123 456',
            hireDate: '2022-03-15',
            status: 'Active'
        },
        {
            id: 2,
            fullName: 'Fatma Khelifi',
            role: 'Quality Technician',
            project: 'JCB',
            productionLines: ['HAULER'],
            email: 'fatma.khelifi@leoni.com',
            phone: '+216 97 234 567',
            hireDate: '2021-09-20',
            status: 'Active'
        },
        {
            id: 3,
            fullName: 'Mohamed Gharbi',
            role: 'Team Leader',
            project: 'MAN',
            productionLines: ['HDEP C1', 'HDEP C2'],
            email: 'mohamed.gharbi@leoni.com',
            phone: '+216 99 345 678',
            hireDate: '2020-01-10',
            status: 'Active'
        },
        {
            id: 4,
            fullName: 'Rim Jebali',
            role: 'AQL (Quality Line Agent)',
            project: 'IVECO',
            productionLines: ['VCE'],
            email: 'rim.jebali@leoni.com',
            phone: '+216 96 456 789',
            hireDate: '2023-05-12',
            status: 'Active'
        },
        {
            id: 5,
            fullName: 'Karim Mansouri',
            role: 'Quality Technician',
            project: 'John Deere',
            productionLines: ['HDEP C3'],
            email: 'karim.mansouri@leoni.com',
            phone: '+216 95 567 890',
            hireDate: '2022-11-03',
            status: 'Active'
        },
        {
            id: 6,
            fullName: 'Sonia Trabelsi',
            role: 'Team Leader',
            project: 'Volvo',
            productionLines: ['MDEP', 'HAULER'],
            email: 'sonia.trabelsi@leoni.com',
            phone: '+216 94 678 901',
            hireDate: '2019-08-15',
            status: 'Active'
        },
        {
            id: 7,
            fullName: 'Youssef Hamdi',
            role: 'AQL (Quality Line Agent)',
            project: 'MAN',
            productionLines: ['HDEP C1'],
            email: 'youssef.hamdi@leoni.com',
            phone: '+216 93 789 012',
            hireDate: '2023-02-28',
            status: 'Active'
        },
        {
            id: 8,
            fullName: 'Nadia Bouazizi',
            role: 'Quality Technician',
            project: 'JCB',
            productionLines: ['VCE', 'HAULER'],
            email: 'nadia.bouazizi@leoni.com',
            phone: '+216 92 890 123',
            hireDate: '2021-12-07',
            status: 'On Leave'
        },
        {
            id: 9,
            fullName: 'Amine Rekik',
            role: 'Team Leader',
            project: 'IVECO',
            productionLines: ['HDEP C2', 'HDEP C3'],
            email: 'amine.rekik@leoni.com',
            phone: '+216 91 901 234',
            hireDate: '2020-06-22',
            status: 'Active'
        },
        {
            id: 10,
            fullName: 'Leila Chaouch',
            role: 'AQL (Quality Line Agent)',
            project: 'John Deere',
            productionLines: ['MDEP'],
            email: 'leila.chaouch@leoni.com',
            phone: '+216 90 012 345',
            hireDate: '2022-07-18',
            status: 'Active'
        }
    ]
};