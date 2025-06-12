// LEONI 5S Checklist Data - 60 Criteria organized by production areas
const fiveSCriteria = {
    prebloc: [
        "Pas de fils et composants au sol. Lignes propres. Pas de fils emmêlés, tube prébloc",
        "Les connexions serties sur joints et comportant des ergots de verrouillage à l'extérieur de la connexion type MQS doivent en priorité être placés devant les opérateurs",
        "Les boîtes de composants ne sont pas surchargées. Pas de dépassement. Pas de mélange",
        "0 effet personnel (sac à main, blouson, yaourt, clés, etc). Sur les postes",
        "Respect de la quantité à préparer (5 pcs max)",
        "Identification des bacs composants / fils",
        "Chaque composant dans son bac",
        "Chaque bac dans son emplacement",
        "Layout planche non détérioré",
        "Documents affichés clairs",
        "Standard du poste affiché et respecté",
        "Présence bac rouge",
        "Pas de carton composant dans les postes",
        "Chariots intermédiaires propres, identifiés avec standard chariot mobile",
        "Standard self composant bien mis en place et identifié",
        "Plan de chargement affiché et respecté"
    ],
    assemblage: [
        "Les outils GAF sont disponibles aux postes de travail et sont en bon état",
        "Les opérateurs utilisent correctement les outils GAF",
        "0 effet personnel (sac à main, blouson, yaourt, clés, etc). dans les lignes",
        "Pas de fils hors des bâches de protection des chariots, des carrousels ou LAD",
        "Présence des bacs rouges sur les postes",
        "Le plan de chargement des chariots porte fils est conforme au standard",
        "Les quantités de fils sont conformes au plan de chargement (25 gross section/50 faible section)",
        "Les bacs de composants ne sont pas surchargées. Pas de dépassement",
        "Aucun mélange de composants dans un même bac",
        "Le layout des planches n'est pas abîmé, usé, sale",
        "Les scraps, les déchets fils et autre que les fils, sont stockés dans les bacs appropriés",
        "Plan de chargement affiché et respecté",
        "Chariot picking identifié et dans son emplacement",
        "Identification du IN et OUT du chariot picking",
        "Les bâches des chariot sont propres et vides",
        "Les supports des documents ne contiennent que les documents nécessaires et non obsolètes",
        "Chaque document est affiché dans son emplacement",
        "Pas de composant sur les places (composants non stockés)",
        "Sacs composants non détériorés, identifiés",
        "Emplacement identifié pour les sacs composants après utilisation",
        "Contre Partie bien propre (pas de joints, pas de déchets à l'intérieur, pas de PVC aux alentours ou ruban collé sur la CP)",
        "Pas d'affichage sauvage",
        "Présence des poubelles pour chaque planche",
        "Présence Kit 5S",
        "Pas de carton composants dans le poste de travail",
        "Propreté et organisation du poste",
        "Protection des extrémités des faisceaux sur chariot",
        "Chaque planche de la ligne a son étiquette de validation signée et tamponnée sur chacune des références / pack validé/ modif validé",
        "Le layout des planches n'est pas abîmé, usé, sale",
        "Pas de fourchette / contrepartie mal fixée",
        "Pistolets lanières bloqués avec date de validation à jour",
        "Aucun mélange de composants dans un même bac",
        "Les documents et fiches d'instructions sont correctement affichés et lisibles par les opérateurs. Ils ne sont pas déchirés"
    ],
    test_electrique: [
        "Propreté et organisation du poste",
        "Protection des extrémités des faisceaux sur chariot",
        "Chaque BOL a son étiquette de validation signée et tamponnée sur chacune des références / pack validé/ modif validé",
        "Les documents et fiches d'instructions sont correctement affichés et lisibles par les opérateurs. Ils ne sont pas déchirés",
        "Contreparties propres, pas de saleté à l'intérieur",
        "0 manque pin à l'intérieur de la contrepartie. Pas de pin cassé ni tordu",
        "Identification des contre parties"
    ],
    controle_final: [
        "Propreté et organisation du poste",
        "Protection des extrémités des faisceaux sur chariot",
        "Chaque planche de la ligne a son étiquette de validation signée et tamponnée sur chacune des références / pack validé/ modif validé",
        "Le layout des planches n'est pas abîmé, usé, sale",
        "Pas de fourchette / contrepartie mal fixée",
        "Cahiers d'enregistrements présents, en état, rangés, bien renseignés et exploités",
        "Les faisceaux rejetés sont stockés dans la zone définie et sont correctement identifiés",
        "Les documents et fiches d'instructions sont correctement affichés et lisibles par les opérateurs. Ils ne sont pas déchirés"
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

// Category information for LEONI production areas
const categoryInfo = {
    prebloc: {
        name: "PRÉBLOC",
        description: "Zone de préparation des composants et fils",
        icon: "🔧",
        color: "#e53e3e"
    },
    assemblage: {
        name: "TABLES D'ASSEMBLAGE DYNAMIQUE/T.CLIP",
        description: "Zone d'assemblage dynamique et test clip",
        icon: "⚙️",
        color: "#dd6b20"
    },
    test_electrique: {
        name: "TEST ÉLECTRIQUE",
        description: "Zone de test électrique des faisceaux",
        icon: "⚡",
        color: "#3182ce"
    },
    controle_final: {
        name: "POSTE ASPECT (Contrôle Final)",
        description: "Zone de contrôle final et aspect qualité",
        icon: "✅",
        color: "#38a169"
    }
};

// Sample historical data for the chart
const historicalData = {
    labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4', 'Semaine Actuelle'],
    datasets: [
        {
            label: 'Lundi',
            data: [85, 88, 92, 89, 91],
            borderColor: '#e53e3e',
            backgroundColor: 'rgba(229, 62, 62, 0.1)',
            tension: 0.4
        },
        {
            label: 'Mardi',
            data: [87, 89, 91, 88, 93],
            borderColor: '#dd6b20',
            backgroundColor: 'rgba(221, 107, 32, 0.1)',
            tension: 0.4
        },
        {
            label: 'Mercredi',
            data: [89, 91, 93, 90, 94],
            borderColor: '#3182ce',
            backgroundColor: 'rgba(49, 130, 206, 0.1)',
            tension: 0.4
        },
        {
            label: 'Jeudi',
            data: [88, 90, 92, 91, 92],
            borderColor: '#38a169',
            backgroundColor: 'rgba(56, 161, 105, 0.1)',
            tension: 0.4
        },
        {
            label: 'Vendredi',
            data: [86, 88, 90, 89, 90],
            borderColor: '#805ad5',
            backgroundColor: 'rgba(128, 90, 213, 0.1)',
            tension: 0.4
        },
        {
            label: 'Samedi',
            data: [84, 86, 88, 87, 88],
            borderColor: '#718096',
            backgroundColor: 'rgba(113, 128, 150, 0.1)',
            tension: 0.4
        }
    ]
};