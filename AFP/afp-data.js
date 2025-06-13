// LEONI AFP Audit Data Structure - 100 checkpoints across 2 main audit forms
const AFP_AUDIT_DATA = {
    categories: [
        {
            id: 'assemblage_planche',
            name: 'ASSEMBLAGE SUR PLANCHE / ENRUBANNEUSE',
            emoji: '🔧',
            color: '#0ea5e9',
            description: 'Assembly on board and taping processes audit',
            subcategories: [
                {
                    name: 'ASSEMBLAGE GÉNÉRAL',
                    checkpoints: [
                        { id: 'ap01', text: 'Plan d\'action audit précédent' },
                        { id: 'ap02', text: 'Propreté du poste' },
                        { id: 'ap03', text: 'Rangement du poste: composants, outillage' },
                        { id: 'ap04', text: 'Respecter le mode opératoire utilisation outil GAF' },
                        { id: 'ap05', text: 'Utilisation outil GAF pour petites et grosses sections' },
                        { id: 'ap06', text: 'Éléments de sécurité' },
                        { id: 'ap07', text: 'Présence Fiche KSK dans chariot' },
                        { id: 'ap08', text: 'Validation de la planche : présence indice' },
                        { id: 'ap09', text: 'État des figurines, instructions, fourchettes' },
                        { id: 'ap10', text: 'Présence et conformité des pions et des capuchons' },
                        { id: 'ap11', text: 'Respect Traitement des non-conforme' },
                        { id: 'ap12', text: 'Implantation de la planche: ergonomique, fonctionnelle' },
                        { id: 'ap13', text: 'État des chariots: propreté, roue, treuil' },
                        { id: 'ap14', text: 'Rangement des fils sur chariot, protégés' },
                        { id: 'ap15', text: 'Protection des fils aux pieds des opérateurs' },
                        { id: 'ap16', text: 'Vérification de la présence du sigle de sécurité sur les Figurines' },
                        { id: 'ap17', text: 'Éclairage' },
                        { id: 'ap18', text: 'Respect du "pousser, tirer"' },
                        { id: 'ap19', text: 'Présence des désenficheurs' },
                        { id: 'ap20', text: 'État des désenficheurs' },
                        { id: 'ap21', text: 'Mode opératoire enrubannage (respect pas et longueur)' },
                        { id: 'ap22', text: 'Identification Poste "0 rework"' },
                        { id: 'ap23', text: 'Respect des indications sur planche' },
                        { id: 'ap24', text: 'Protection des faisceaux sur chariot / rack' },
                        { id: 'ap25', text: 'Qualification de l\'opérateur' },
                        { id: 'ap26', text: 'Étalonnage des pistolets de serrage' }
                    ]
                },
                {
                    name: 'CONFORMITÉ DU PRODUIT',
                    checkpoints: [
                        { id: 'ap27', text: 'Conformité des faisceaux' },
                        { id: 'ap28', text: 'Conformité des fils: isolant non altéré' }
                    ]
                },
                {
                    name: 'TEST AGRAFES',
                    checkpoints: [
                        { id: 'ap29', text: 'Propreté et organisation du poste' },
                        { id: 'ap30', text: 'Protection des extrémités des faisceaux sur chariot' },
                        { id: 'ap31', text: 'Qualification de l\'opérateur' },
                        { id: 'ap32', text: 'Validation qualité de la planche' },
                        { id: 'ap33', text: 'État des figurines, instructions, fourchettes' },
                        { id: 'ap34', text: 'État des contreparties, détecteurs' },
                        { id: 'ap35', text: 'Fonctionnement des contreparties, détecteurs, réglage' },
                        { id: 'ap36', text: 'Maintenance des contreparties, détecteurs' },
                        { id: 'ap37', text: 'Maintenance des imprimantes' }
                    ]
                },
                {
                    name: 'OK DMS / ZERO REWORK',
                    checkpoints: [
                        { id: 'ap38', text: 'Enregistrements / cohérence du OK Démarrage' },
                        { id: 'ap39', text: 'Connaissance des réparations interdites' },
                        { id: 'ap40', text: 'Instructions des réparations autorisées' },
                        { id: 'ap41', text: 'Enregistrement des réparations' }
                    ]
                },
                {
                    name: 'DOCUMENTS AU POSTE',
                    checkpoints: [
                        { id: 'ap42', text: 'Présence des instructions aux postes' },
                        { id: 'ap43', text: 'Utilisation du format définit par le système Qualité' },
                        { id: 'ap44', text: 'Les instructions sont signées par les personnes concernées' },
                        { id: 'ap45', text: 'Les instructions sont claires et lisibles' },
                        { id: 'ap46', text: 'Les instructions sont bien rangées' },
                        { id: 'ap47', text: 'Le contenu des instructions est conforme aux tâches réalisées' },
                        { id: 'ap48', text: 'Le contenu des instructions est connu par le personnel' },
                        { id: 'ap49', text: 'Les instructions sont appliquées' },
                        { id: 'ap50', text: 'Les instructions ont évolué suite à la modification du produit et/ou du process' }
                    ]
                }
            ]
        },
        {
            id: 'controle_finition',
            name: 'CONTRÔLE, FINITION, CONDITIONNEMENT',
            emoji: '🔍',
            color: '#f59e0b',
            description: 'Control, finishing and packaging processes audit',
            subcategories: [
                {
                    name: 'CONTRÔLE VISUEL',
                    checkpoints: [
                        { id: 'cf01', text: 'Plan d\'action audit précédent' },
                        { id: 'cf02', text: 'Propreté et organisation du poste' },
                        { id: 'cf03', text: 'Organisation des flux' },
                        { id: 'cf04', text: 'Marquage des zones au sol' },
                        { id: 'cf05', text: 'Protection des extrémités sur chariot / racks' },
                        { id: 'cf06', text: 'Contenu fiche de points particuliers à contrôler' },
                        { id: 'cf07', text: 'Présence et pertinence de la panoplie de défauts' },
                        { id: 'cf08', text: 'Respect Traitement des non-conforme' },
                        { id: 'cf09', text: 'Bible des défauts dernière version' },
                        { id: 'cf10', text: 'Respect de la fiche de points particuliers à contrôler' },
                        { id: 'cf11', text: 'Enregistrement des défauts' },
                        { id: 'cf12', text: 'Tampon sur étiquette d\'identification' },
                        { id: 'cf13', text: 'Validation des pièces non conformes' },
                        { id: 'cf14', text: 'Éclairage' },
                        { id: 'cf15', text: 'Connaissance des principaux défauts' },
                        { id: 'cf16', text: 'Qualification de l\'opérateur' }
                    ]
                },
                {
                    name: 'CONTRÔLE ÉLECTRIQUE',
                    checkpoints: [
                        { id: 'cf17', text: 'Présence des faisceaux témoins' },
                        { id: 'cf18', text: 'Validation de la planche / BOL (visa Qualité sur la fiche de validation)' },
                        { id: 'cf19', text: 'Validation de la carte de test' },
                        { id: 'cf20', text: 'Fonctionnement des contreparties, détecteurs, réglage' },
                        { id: 'cf21', text: 'Maintenance des contreparties, détecteurs' },
                        { id: 'cf22', text: 'Maintenance des imprimantes thermiques' },
                        { id: 'cf23', text: 'Présence des désenficheurs' },
                        { id: 'cf24', text: 'État des désenficheurs' },
                        { id: 'cf25', text: 'Lisibilité de l\'étiquette d\'identification' },
                        { id: 'cf26', text: 'Cohérence étiquette identification/ KSK' },
                        { id: 'cf27', text: 'Étalonnage de pistolets' },
                        { id: 'cf28', text: 'Présence document au poste' },
                        { id: 'cf29', text: 'Respect Traitement des non-conforme' },
                        { id: 'cf30', text: 'Bible de défauts' },
                        { id: 'cf31', text: 'Enregistrement des défauts' }
                    ]
                },
                {
                    name: 'FINITION',
                    checkpoints: [
                        { id: 'cf32', text: 'Rangement du poste: composants, outillage' },
                        { id: 'cf33', text: 'Présence et pertinence des documents au poste' },
                        { id: 'cf34', text: 'Respect des indications sur planche' }
                    ]
                },
                {
                    name: 'CONDITIONNEMENT',
                    checkpoints: [
                        { id: 'cf35', text: 'Document pour sous conditionnement (pliage, poche)' },
                        { id: 'cf36', text: 'Respect du sous conditionnement' },
                        { id: 'cf37', text: 'État des cartons, nefabs, gefbox' },
                        { id: 'cf38', text: 'Rangement des faisceaux dans contenant' },
                        { id: 'cf39', text: 'État lecteur code à barre' },
                        { id: 'cf40', text: 'Lisibilité étiquette lecteur code à barre' }
                    ]
                },
                {
                    name: 'OK DMS / ZERO REWORK',
                    checkpoints: [
                        { id: 'cf41', text: 'Enregistrements / cohérence du OK Démarrage' },
                        { id: 'cf42', text: 'Connaissance des réparations interdites' },
                        { id: 'cf43', text: 'Instructions des réparations autorisées' },
                        { id: 'cf44', text: 'Enregistrement des réparations' }
                    ]
                },
                {
                    name: 'DOCUMENTS AU POSTE',
                    checkpoints: [
                        { id: 'cf45', text: 'Présence des instructions aux postes' },
                        { id: 'cf46', text: 'Utilisation du format définit par le système Qualité' },
                        { id: 'cf47', text: 'Les instructions sont signées par les personnes concernées' },
                        { id: 'cf48', text: 'Les instructions sont claires et lisibles' },
                        { id: 'cf49', text: 'Les instructions sont bien rangées' },
                        { id: 'cf50', text: 'Le contenu des instructions est conforme aux tâches réalisées' },
                        { id: 'cf51', text: 'Le contenu des instructions est connu par le personnel' },
                        { id: 'cf52', text: 'Les instructions sont appliquées' },
                        { id: 'cf53', text: 'Les instructions ont évolué suite à la modification du produit et/ou du process' }
                    ]
                }
            ]
        }
    ]
};

// Form options for dropdowns
const FORM_OPTIONS = {
    auditors: [
        'Jean Dupont',
        'Marie Martin',
        'Pierre Durand',
        'Sophie Lefebvre',
        'Michel Bernard',
        'Claire Moreau',
        'Antoine Petit',
        'Nathalie Robert'
    ],
    sectors: [
        'ASSEMBLAGE',
        'CONTRÔLE QUALITÉ',
        'FINITION',
        'CONDITIONNEMENT',
        'TEST ÉLECTRIQUE',
        'PRÉBLOC',
        'LOGISTIQUE'
    ],
    vehicleFamilies: [
        'Peugeot 308',
        'Peugeot 508',
        'Citroën C4',
        'Citroën C5',
        'Opel Astra',
        'Opel Insignia',
        'Fiat Tipo',
        'Fiat 500L'
    ]
};

// Sample audit data for demonstration
const SAMPLE_AUDIT_DATA = {
    documentInfo: {
        date: '2024-12-13',
        auditor: 'Jean Dupont',
        sector: 'ASSEMBLAGE',
        vehicleFamily: 'Peugeot 308'
    },
    results: {
        // Assemblage sur planche samples
        'ap01': { correct: true, nonCorrect: false, details: 'Plan d\'action suivi correctement' },
        'ap02': { correct: true, nonCorrect: false, details: 'Poste propre et organisé' },
        'ap03': { correct: false, nonCorrect: true, details: 'Outils mal rangés, amélioration nécessaire' },
        'ap04': { correct: true, nonCorrect: false, details: 'Mode opératoire GAF respecté' },
        'ap05': { correct: true, nonCorrect: false, details: 'Outil GAF utilisé correctement' },
        
        // Contrôle finition samples
        'cf01': { correct: true, nonCorrect: false, details: 'Plan d\'action en cours' },
        'cf02': { correct: true, nonCorrect: false, details: 'Organisation conforme' },
        'cf03': { correct: false, nonCorrect: true, details: 'Flux à améliorer' },
        'cf04': { correct: true, nonCorrect: false, details: 'Marquage au sol visible' },
        'cf05': { correct: true, nonCorrect: false, details: 'Protections en place' }
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

// Export data for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AFP_AUDIT_DATA,
        SAMPLE_AUDIT_DATA,
        HISTORICAL_AUDIT_DATA,
        FORM_OPTIONS
    };
}
