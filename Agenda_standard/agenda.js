// Agenda Standard JavaScript
// LEONI QMS - Agent Qualité Ligne

// Morning shift schedule data - LEONI AQL Agenda Standard
const morningShiftData = [
    {
        category: "PRISE DE POSTE",
        tasks: [
            {
                task: "1) Vérifier le cahier de consignes et prendre les informations des AQL précédentes",
                time: "6h55 à 7h05",
                duration: "10min",
                type: "prise-poste",
                reaction: "Signaler au chef d'équipe"
            },
            {
                task: "2) Distribuer les cahiers de relevés de contrôle",
                time: "7h05 à 7h25",
                duration: "20min",
                type: "prise-poste",
                reaction: "Vérifier disponibilité cahiers"
            },
            {
                task: "3) Relever l'absentéisme sur les postes à risque",
                time: "7h05 à 7h25",
                duration: "20min",
                type: "prise-poste",
                reaction: "Informer TL des absences"
            },
            {
                task: "4) Vérifier la validation des remplaçants des opérateurs absents",
                time: "7h05 à 7h25",
                duration: "20min",
                type: "prise-poste",
                reaction: "Valider compétences remplaçants"
            },
            {
                task: "5) Vérifier l'enregistrement des relées de contrôle finale /quality gate/bol /firewall",
                time: "7h05 à 7h25",
                duration: "20min",
                type: "prise-poste",
                reaction: "Corriger enregistrements manquants"
            },
            {
                task: "6) Vérifier que la réparatrice est présente (sinon sa remplaçante) et identifiée par son brassard (vérifier l'état des outils de désenfichage et cahier d'enregistrement)",
                time: "7h05 à 7h25",
                duration: "20min",
                type: "prise-poste",
                reaction: "Organiser remplacement si nécessaire"
            },
            {
                task: "7) Vérifier la cohérence entre le tableau de polyvalence et les personnes sur la ligne (tableau à jour)",
                time: "7h05 à 7h25",
                duration: "20min",
                type: "prise-poste",
                reaction: "Mettre à jour tableau polyvalence"
            },
            {
                task: "8) Vérifier la présence des outils GAF pour petites et grosses sections",
                time: "7h05 à 7h25",
                duration: "20min",
                type: "prise-poste",
                reaction: "Récupérer outils manquants"
            }
        ]
    },
    {
        category: "EN POSTE",
        tasks: [
            {
                task: "9) Faire la saisie des défauts dans la base et apporter les données de la Réunion 5min",
                time: "7h25 à 7h45",
                duration: "20min",
                type: "en-poste",
                reaction: "Vérifier saisie complète"
            },
            {
                task: "10) Respecter le mode opératoire d'utilisation outil GAF",
                time: "Continu",
                duration: "Continu",
                type: "en-poste",
                reaction: "Reprendre formation si nécessaire"
            },
            {
                task: "11) Vérifier la présence des QRQC par rapport aux défauts (nombre, détection, date..), respect 5 équipes et animer les QRQC ligne avec les TS",
                time: "7h45 à 8h05, 10h00, 12h00 et 14h40",
                duration: "20min par ZAP chaque 2 heures",
                type: "en-poste",
                reaction: "Créer QRQC si manquant"
            },
            {
                task: "12) Faire des audits QK et remplir l'enregistrement, avec vérification du remplissage fiche bâtonnage",
                time: "08h05, 11h00 et à 13h",
                duration: "1h",
                type: "en-poste",
                reaction: "Compléter fiches manquantes"
            },
            {
                task: "13) Auditer et vérifier l'application des OK démarrage sur chaque poste audité: -Montage: Carrousel / LAD -Test Agrafe -BOL",
                time: "10h00",
                duration: "2h",
                type: "en-poste",
                reaction: "Corriger non-conformités"
            },
            {
                task: "14) Vérifier le nombre de faisceau par crochet en fin de ligne et sur chariot par rapport à ce qui est demandé",
                time: "Continu",
                duration: "Ponctuel",
                type: "en-poste",
                reaction: "Ajuster quantités"
            },
            {
                task: "Auditer le respect du produit en Zone d'assemblage: -Pas de fils et composants au sol -Pas de fils hors des bâches de protection des Carrousels ou LAD -Les chariots de fils sont réglés à la bonne hauteur pour laisser un espace mini de 100 mm entre les extrémités et le fond du chariot -Pas de chariots porte fils sans bâche plastique ou carter bois -Pas de fil hors de protections des chariots (bâche ou carter) -Pas de fils emmêlés dans le chariot -Le plan de chargement des chariots porte fils est conforme au standard -les Quantités de fils sont conformes au plan de chargement -Le fond des chariots ou bac bois est propre -Les boîtes de composants sont identifiées, ne sont pas surchargées, pas de mélange composant -Aucun fil ou aucune épissure stockée hors chariot ou hors support -Aucun composant pré chargé sur les chariots de fils (sauf si standard spécifique)",
                time: "12h00",
                duration: "2h30",
                type: "en-poste",
                reaction: "Corriger immédiatement les non-conformités"
            },
            {
                task: "Auditer le nettoyage des contres-parties sur BOL: Nettoyage se fait par aspirateur",
                time: "12h00",
                duration: "Inclus dans audit",
                type: "en-poste",
                reaction: "Nettoyer si nécessaire"
            },
            {
                task: "15) Les connexions serties sur joint et composant des ergots de verrouillage à l'extérieur de la connexion type MQS doivent en priorité être placés devant les opérateurs",
                time: "Continu",
                duration: "Vérification",
                type: "en-poste",
                reaction: "Repositionner si mal placés"
            },
            {
                task: "17) Validation produit ou process selon le planning",
                time: "Selon planning",
                duration: "Variable",
                type: "en-poste",
                reaction: "Suivre procédure validation"
            }
        ]
    },
    {
        category: "LA PAUSE",
        tasks: [
            {
                task: "Pause",
                time: "Variable",
                duration: "30min",
                type: "pause",
                reaction: "Transmission des consignes"
            }
        ]
    },
    {
        category: "FIN DE POSTE",
        tasks: [
            {
                task: "16) Vérifier l'encours, les bacs rouges et application des 5S",
                time: "14h30 à 14h40",
                duration: "10min",
                type: "fin-poste",
                reaction: "Nettoyer et organiser"
            },
            {
                task: "17) Renseigner le cahier de consignes et informer l'AQL lors de changement d'équipe",
                time: "14h40 à 14h55",
                duration: "15min",
                type: "fin-poste",
                reaction: "Transmission complète obligatoire"
            }
        ]
    }
];

// Reaction modes data
const reactionModes = [
    "Signaler au chef d'équipe",
    "Vérifier disponibilité cahiers",
    "Informer TL des absences",
    "Valider compétences remplaçants",
    "Corriger enregistrements manquants",
    "Organiser remplacement si nécessaire",
    "Mettre à jour tableau polyvalence",
    "Récupérer outils manquants",
    "Vérifier saisie complète",
    "Reprendre formation si nécessaire",
    "Créer QRQC si manquant",
    "Compléter fiches manquantes",
    "Corriger non-conformités",
    "Ajuster quantités",
    "Corriger immédiatement les non-conformités",
    "Nettoyer si nécessaire",
    "Repositionner si mal placés",
    "Suivre procédure validation",
    "Transmission des consignes",
    "Nettoyer et organiser",
    "Transmission complète obligatoire"
];

// Days of the week
const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

class AgendaManager {
    constructor() {
        this.currentShift = 'morning';
        this.agendaGrid = document.getElementById('agendaGrid');
        this.shiftSelect = document.getElementById('shiftSelect');
        this.currentWeekElement = document.getElementById('currentWeek');
        
        this.init();
    }

    init() {
        this.updateCurrentWeek();
        this.setupEventListeners();
        this.renderAgenda();
    }

    updateCurrentWeek() {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const pastDaysOfYear = (now - startOfYear) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
        
        if (this.currentWeekElement) {
            this.currentWeekElement.textContent = weekNumber;
        }
    }

    setupEventListeners() {
        if (this.shiftSelect) {
            this.shiftSelect.addEventListener('change', (e) => {
                this.currentShift = e.target.value;
                this.renderAgenda();
            });
        }
    }

    renderAgenda() {
        if (!this.agendaGrid) return;

        // Clear existing content except headers
        this.clearDynamicContent();

        // Render based on current shift
        switch (this.currentShift) {
            case 'morning':
                this.renderMorningShift();
                break;
            case 'afternoon':
                this.renderNotAvailable('Équipe d\'Après-midi');
                break;
            case 'night':
                this.renderNotAvailable('Équipe de Nuit');
                break;
            default:
                this.renderMorningShift();
        }
    }

    clearDynamicContent() {
        // Remove all elements that are not headers or day-subheaders
        const staticElements = this.agendaGrid.querySelectorAll('.grid-header, .day-subheader');
        this.agendaGrid.innerHTML = '';
        
        // Re-add static elements
        staticElements.forEach(element => {
            this.agendaGrid.appendChild(element);
        });
    }

    renderMorningShift() {
        morningShiftData.forEach((category, categoryIndex) => {
            // Render category header
            this.renderCategoryHeader(category.category);

            // Render tasks for this category
            category.tasks.forEach((task, taskIndex) => {
                this.renderTaskRow(task, `${categoryIndex}-${taskIndex}`);
            });
        });
    }

    renderCategoryHeader(categoryName) {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'task-category';
        categoryElement.textContent = categoryName;
        this.agendaGrid.appendChild(categoryElement);
    }

    renderTaskRow(task, taskId) {
        // Task name
        const taskCell = this.createCell('task-cell', task.task, task.type);
        
        // Time
        const timeCell = this.createCell('time-cell', task.time);
        
        // Duration
        const durationCell = this.createCell('duration-cell', task.duration);
        
        // Days (OK/NOK checkboxes for each day)
        const dayCheckboxes = [];
        daysOfWeek.forEach((day, dayIndex) => {
            // OK checkbox
            const okCell = this.createCheckboxCell(`${taskId}-${dayIndex}-ok`, false);
            dayCheckboxes.push(okCell);
            
            // NOK checkbox
            const nokCell = this.createCheckboxCell(`${taskId}-${dayIndex}-nok`, true);
            dayCheckboxes.push(nokCell);
        });
        
        // Comments
        const commentsCell = this.createCommentsCell(`${taskId}-comments`);
        
        // Reaction mode
        const reactionCell = this.createReactionCell(`${taskId}-reaction`, task.reaction);
        
        // Append all cells
        [taskCell, timeCell, durationCell, ...dayCheckboxes, commentsCell, reactionCell].forEach(cell => {
            this.agendaGrid.appendChild(cell);
        });
    }

    createCell(className, content, taskType = '') {
        const cell = document.createElement('div');
        cell.className = `grid-cell ${className}`;
        if (taskType) {
            cell.classList.add(`task-${taskType}`);
        }
        cell.textContent = content;
        return cell;
    }

    createCheckboxCell(id, isNok = false) {
        const cell = document.createElement('div');
        cell.className = `grid-cell checkbox-cell ${isNok ? 'nok-cell' : 'ok-cell'}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.addEventListener('change', (e) => this.handleCheckboxChange(e, isNok));
        
        cell.appendChild(checkbox);
        return cell;
    }

    createCommentsCell(id) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell comments-cell';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = id;
        input.placeholder = 'Commentaires...';
        
        cell.appendChild(input);
        return cell;
    }

    createReactionCell(id, defaultReaction) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell reaction-cell';
        
        const select = document.createElement('select');
        select.id = id;
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = defaultReaction;
        defaultOption.textContent = defaultReaction;
        defaultOption.selected = true;
        select.appendChild(defaultOption);
        
        // Add other reaction modes
        reactionModes.forEach(reaction => {
            if (reaction !== defaultReaction) {
                const option = document.createElement('option');
                option.value = reaction;
                option.textContent = reaction;
                select.appendChild(option);
            }
        });
        
        cell.appendChild(select);
        return cell;
    }

    handleCheckboxChange(event, isNok) {
        const checkbox = event.target;
        const taskRowElement = checkbox.closest('.grid-row') || checkbox.parentElement;
        
        // If this is a NOK checkbox and it's checked, enable comments
        if (isNok && checkbox.checked) {
            this.enableCommentsForTask(taskRowElement);
            this.showAlert('NOK détecté', 'Veuillez remplir les commentaires et vérifier le mode de réaction.');
        }
        
        // Ensure only one checkbox per day can be selected
        const dayIndex = this.getDayIndexFromCheckboxId(checkbox.id);
        const taskId = this.getTaskIdFromCheckboxId(checkbox.id);
        
        if (checkbox.checked) {
            // Uncheck the opposite checkbox for the same day
            const oppositeType = isNok ? 'ok' : 'nok';
            const oppositeCheckbox = document.getElementById(`${taskId}-${dayIndex}-${oppositeType}`);
            if (oppositeCheckbox) {
                oppositeCheckbox.checked = false;
            }
        }
    }

    getDayIndexFromCheckboxId(checkboxId) {
        const parts = checkboxId.split('-');
        return parts[parts.length - 2]; // Should be the day index
    }

    getTaskIdFromCheckboxId(checkboxId) {
        const parts = checkboxId.split('-');
        return parts.slice(0, -2).join('-'); // Everything except last two parts
    }

    enableCommentsForTask(taskRowElement) {
        const commentsInput = taskRowElement.querySelector('.comments-cell input');
        if (commentsInput) {
            commentsInput.focus();
            commentsInput.style.borderColor = '#ef4444';
            commentsInput.style.backgroundColor = '#fef2f2';
        }
    }

    showAlert(title, message) {
        // Simple alert for now - could be enhanced with a custom modal
        alert(`${title}\n\n${message}`);
    }

    renderNotAvailable(shiftName) {
        const notAvailableElement = document.createElement('div');
        notAvailableElement.className = 'not-available';
        notAvailableElement.style.cssText = `
            grid-column: 1 / -1;
            padding: 40px;
            text-align: center;
            background: #f8fafc;
            border: 2px dashed #d1d5db;
            color: #6b7280;
            font-size: 1.2em;
            margin: 20px 0;
        `;
        notAvailableElement.innerHTML = `
            <h3>${shiftName}</h3>
            <p>Cette équipe n'est pas encore configurée.</p>
            <p>Veuillez sélectionner l'équipe du matin pour voir l'agenda standard.</p>
        `;
        
        this.agendaGrid.appendChild(notAvailableElement);
    }

    // Method to export data (could be used for saving/printing)
    exportData() {
        const data = {
            shift: this.currentShift,
            week: this.currentWeekElement?.textContent || '',
            date: new Date().toISOString(),
            tasks: []
        };

        // Collect all checkbox states and comments
        const checkboxes = this.agendaGrid.querySelectorAll('input[type="checkbox"]');
        const comments = this.agendaGrid.querySelectorAll('.comments-cell input');
        const reactions = this.agendaGrid.querySelectorAll('.reaction-cell select');

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                data.tasks.push({
                    id: checkbox.id,
                    checked: true,
                    type: checkbox.id.includes('nok') ? 'NOK' : 'OK'
                });
            }
        });

        comments.forEach(comment => {
            if (comment.value.trim()) {
                data.tasks.push({
                    id: comment.id,
                    comment: comment.value
                });
            }
        });

        reactions.forEach(reaction => {
            data.tasks.push({
                id: reaction.id,
                reaction: reaction.value
            });
        });

        return data;
    }
}

// Initialize the agenda when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const agendaManager = new AgendaManager();
    
    // Make agendaManager globally accessible for debugging
    window.agendaManager = agendaManager;
    
    // Add print functionality
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', () => {
        document.body.classList.remove('printing');
    });
});

// Utility functions
function getCurrentDate() {
    const now = new Date();
    return now.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getCurrentWeek() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now - startOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AgendaManager,
        morningShiftData,
        reactionModes
    };
}
