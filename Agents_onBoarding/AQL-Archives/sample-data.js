// AQL Archives Sample Data
// This file contains sample historical audit data for testing and demonstration

const sampleArchiveData = {
    "5s_audits": [
        {
            "id": "5S-2025-001",
            "date": "2025-06-20",
            "auditeur": "Mohammed Bennani",
            "productionLine": "HDEP-C1",
            "workspaceAreas": ["Prébloc", "Assemblage", "Test Électrique", "Contrôle Final"],
            "scores": {
                "seiri": 18, // Sort - Débarrasser
                "seiton": 17, // Set in Order - Ranger
                "seiso": 19, // Shine - Nettoyer
                "seiketsu": 16, // Standardize - Standardiser
                "shitsuke": 15  // Sustain - Suivre/Maintenir
            },
            "totalScore": 85,
            "maxScore": 100,
            "percentage": 85,
            "improvements": [
                "Améliorer le marquage au sol dans la zone Prébloc",
                "Installer des supports pour outils zone Assemblage",
                "Renforcer la propreté de la zone Test Électrique"
            ],
            "photos": ["5s_hdep_c1_before.jpg", "5s_hdep_c1_after.jpg"],
            "status": "completed"
        },
        {
            "id": "5S-2025-002",
            "date": "2025-06-18",
            "auditeur": "Fatima El Mansouri",
            "productionLine": "VCE",
            "workspaceAreas": ["Prébloc", "Assemblage"],
            "scores": {
                "seiri": 20,
                "seiton": 19,
                "seiso": 18,
                "seiketsu": 17,
                "shitsuke": 18
            },
            "totalScore": 92,
            "maxScore": 100,
            "percentage": 92,
            "improvements": [
                "Excellent maintien des standards 5S",
                "Zone exemplaire pour formation nouveaux agents"
            ],
            "photos": ["5s_vce_audit.jpg"],
            "status": "validated"
        }
    ],
    "afp_audits": [
        {
            "id": "AFP-2025-024",
            "date": "2025-06-19",
            "auditeur": "Ahmed Zouari",
            "productionLine": "HDEP-C2",
            "checkpoints": {
                "preparation": 25,
                "assemblage": 30,
                "soudure": 20,
                "controle": 25
            },
            "results": {
                "preparation": 23,
                "assemblage": 28,
                "soudure": 16,
                "controle": 24
            },
            "totalScore": 91,
            "maxScore": 100,
            "percentage": 91,
            "criticalIssues": [
                "Température de soudure non conforme sur 3 échantillons",
                "Procédure de nettoyage non respectée poste 12"
            ],
            "recommendations": [
                "Formation équipe soudure sur nouveaux paramètres",
                "Audit surprise hebdomadaire zone critique"
            ],
            "status": "completed"
        }
    ],
    "tram_reports": [
        {
            "id": "TRAM-2025-156",
            "date": "2025-06-17",
            "auditeur": "Leila Hajji",
            "productionLine": "MDEP",
            "metrics": {
                "scrapWeight": 45.6,
                "unit": "grams",
                "reworkItems": 12,
                "totalProduction": 2840,
                "defectRate": 0.42,
                "ppmCalculation": 148
            },
            "analysis": {
                "scrapTrend": "decreasing",
                "reworkTrend": "stable",
                "ppmTrend": "improving"
            },
            "rootCauses": [
                "Déréglage machine poste 7",
                "Formation insuffisante opérateur nouveau"
            ],
            "actions": [
                "Maintenance préventive machine poste 7",
                "Formation complémentaire opérateur"
            ],
            "status": "validated"
        }
    ],
    "qk_audits": [
        {
            "id": "QK-2025-089",
            "date": "2025-06-16",
            "auditeur": "Nadia Slimani",
            "productionLine": "HAULER",
            "productInfo": {
                "pieceDescription": "Faisceau moteur VOLVO XC90",
                "typeVehicule": "VOLVO_XC90",
                "famille": "faisceau-moteur",
                "reference": "VLV-XC90-MTR-001",
                "indice": "C"
            },
            "metrics": {
                "nombreFaisceaux": 50,
                "pointsDemerites": 3.2,
                "facteurEvaluation": 1.8,
                "nombreDefauts": 2,
                "defauts100Points": 5.76
            },
            "testTypes": ["destructive", "nonDestructive"],
            "defects": [
                {
                    "code": "DEF001",
                    "type": "Sertissage défaillant",
                    "frequency": 2,
                    "pointsPerDefect": 2.5,
                    "totalPoints": 5.0,
                    "actionAmelioration": "Réglage machine sertisseuse"
                }
            ],
            "totalScore": 94.24,
            "status": "validated"
        }
    ],
    "clientAuditPackages": [
        {
            "packageId": "CLIENT-PKG-2025-Q2",
            "createdDate": "2025-06-21",
            "client": "VOLVO Cars",
            "auditPeriod": {
                "from": "2025-04-01",
                "to": "2025-06-20"
            },
            "includedAudits": [
                "5S-2025-001", "5S-2025-002",
                "AFP-2025-024",
                "TRAM-2025-156",
                "QK-2025-089"
            ],
            "summary": {
                "totalAudits": 5,
                "averageScore": 90.45,
                "criticalIssues": 1,
                "improvementActions": 8,
                "complianceRate": 98.2
            },
            "presentation": {
                "language": "fr",
                "format": "pdf",
                "includePhotos": true,
                "includeCharts": true
            }
        }
    ]
};

// Export for use in archive system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = sampleArchiveData;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.sampleArchiveData = sampleArchiveData;
}
