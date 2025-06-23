// Agenda Standard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize current week display
    initializeWeekDisplay();
    
    // Initialize shift selector
    initializeShiftSelector();
    
    // Initialize checkbox interactions
    initializeCheckboxes();
    
    // Initialize save functionality
    initializeSaveFunction();
    
    // Initialize save status indicator
    initializeSaveStatus();
    
    // Initialize progress tracking
    initializeProgressTracking();
    
    console.log('Agenda Standard initialized');
});

// Initialize save status indicator
function initializeSaveStatus() {
    const lastSaved = localStorage.getItem('agendaLastSaved');
    if (lastSaved) {
        updateSaveStatus('saved', `Dernière sauvegarde: ${new Date(lastSaved).toLocaleString('fr-FR')}`);
    }
}

// Update save status indicator
function updateSaveStatus(type, message) {
    const saveStatus = document.getElementById('saveStatus');
    if (saveStatus) {
        saveStatus.className = `save-status ${type}`;
        saveStatus.textContent = message;
        
        if (type === 'saved') {
            setTimeout(() => {
                saveStatus.textContent = '';
                saveStatus.className = 'save-status';
            }, 3000);
        }
    }
}

// Initialize progress tracking
function initializeProgressTracking() {
    console.log('Initializing progress tracking...');
    updateProgressBar();
    
    // Update progress when checkboxes change
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    console.log('Found checkboxes for progress tracking:', checkboxes.length);
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProgressBar);
    });
}

// Update progress bar
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill && progressText) {
        const percentage = getCompletionPercentage();
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}%`;
        
        // Change color based on completion
        if (percentage >= 90) {
            progressFill.style.background = 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
        } else if (percentage >= 70) {
            progressFill.style.background = 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';
        }
        
        console.log('Progress updated:', percentage + '%');
    } else {
        console.log('Progress bar elements not found');
    }
}

// Display current week number
function initializeWeekDisplay() {
    const currentWeekElement = document.getElementById('currentWeek');
    if (currentWeekElement) {
        const currentDate = new Date();
        const weekNumber = getWeekNumber(currentDate);
        currentWeekElement.textContent = weekNumber;
        console.log('Current week initialized:', weekNumber);
    }
}

// Calculate week number (ISO 8601 standard)
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNumber;
}

// Initialize shift selector functionality
function initializeShiftSelector() {
    const shiftSelect = document.getElementById('shiftSelect');
    if (shiftSelect) {
        shiftSelect.addEventListener('change', function() {
            const selectedShift = this.value;
            console.log('Selected shift:', selectedShift);
            
            // Store the selection
            localStorage.setItem('selectedShift', selectedShift);
            
            // Update time displays based on shift
            updateTimeDisplays(selectedShift);
        });
        
        // Load previously selected shift
        const savedShift = localStorage.getItem('selectedShift');
        if (savedShift) {
            shiftSelect.value = savedShift;
            updateTimeDisplays(savedShift);
        }
    }
}

// Update time displays based on selected shift
function updateTimeDisplays(shift) {
    // This function could be expanded to show different times for different shifts
    // For now, it just highlights the current shift's time information
    const timeCells = document.querySelectorAll('.time-cell');
    timeCells.forEach(cell => {
        if (shift === 'morning') {
            cell.style.backgroundColor = '#f0f9ff';
        } else if (shift === 'afternoon') {
            cell.style.backgroundColor = '#fff7ed';
        } else if (shift === 'night') {
            cell.style.backgroundColor = '#f3f4f6';
        }
    });
}

// Initialize checkbox interactions
function initializeCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
            const row = this.closest('tr');
            const textarea = row.querySelector('textarea');
            
            // Check if this is a NOK checkbox (odd-indexed within the day columns)
            const cell = this.closest('td');
            const cellIndex = Array.from(row.children).indexOf(cell);
            const isNokColumn = cellIndex >= 4 && cellIndex <= 15 && (cellIndex - 4) % 2 === 1;
            
            if (this.checked && isNokColumn && textarea) {
                textarea.focus();
                textarea.placeholder = 'Veuillez décrire le problème détecté...';
                textarea.style.backgroundColor = '#fef2f2';
            }
            
            // Visual feedback for checked items
            if (this.checked) {
                cell.style.backgroundColor = isNokColumn ? '#fef2f2' : '#f0fdf4';
            } else {
                cell.style.backgroundColor = '';
            }
            
            // Save state
            saveCheckboxState();
            
            // Update progress
            updateProgressBar();
        });
    });
    
    // Load saved checkbox states
    loadCheckboxStates();
}

// Save checkbox states to localStorage
function saveCheckboxState() {
    updateSaveStatus('saving', 'Sauvegarde en cours...');
    
    try {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const states = {};
        
        checkboxes.forEach((checkbox, index) => {
            states[`checkbox_${index}`] = checkbox.checked;
        });
        
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach((textarea, index) => {
            states[`textarea_${index}`] = textarea.value;
        });
        
        localStorage.setItem('agendaStates', JSON.stringify(states));
        
        // Save timestamp
        const timestamp = new Date().toISOString();
        localStorage.setItem('agendaLastSaved', timestamp);
        
        updateSaveStatus('saved', 'Données sauvegardées');
        console.log('Data saved successfully');
    } catch (error) {
        updateSaveStatus('error', 'Erreur de sauvegarde');
        console.error('Error saving data:', error);
    }
}

// Manual save function for button
function saveData() {
    saveCheckboxState();
}

// Load checkbox states from localStorage
function loadCheckboxStates() {
    const savedStates = localStorage.getItem('agendaStates');
    if (savedStates) {
        try {
            const states = JSON.parse(savedStates);
            
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach((checkbox, index) => {
                if (states[`checkbox_${index}`] !== undefined) {
                    checkbox.checked = states[`checkbox_${index}`];
                    
                    // Apply visual feedback
                    if (checkbox.checked) {
                        const cell = checkbox.closest('td');
                        const row = checkbox.closest('tr');
                        const cellIndex = Array.from(row.children).indexOf(cell);
                        const isNokColumn = cellIndex >= 4 && cellIndex <= 15 && (cellIndex - 4) % 2 === 1;
                        cell.style.backgroundColor = isNokColumn ? '#fef2f2' : '#f0fdf4';
                    }
                }
            });
            
            const textareas = document.querySelectorAll('textarea');
            textareas.forEach((textarea, index) => {
                if (states[`textarea_${index}`] !== undefined) {
                    textarea.value = states[`textarea_${index}`];
                    if (textarea.value) {
                        textarea.style.backgroundColor = '#fffbeb';
                    }
                }
            });
            
            console.log('Checkbox states loaded from localStorage');
            updateProgressBar(); // Update progress after loading states
        } catch (error) {
            console.error('Error loading checkbox states:', error);
        }
    }
}

// Initialize save functionality
function initializeSaveFunction() {
    // Auto-save on textarea changes
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            if (this.value) {
                this.style.backgroundColor = '#fffbeb';
            } else {
                this.style.backgroundColor = '';
            }
            debounce(saveCheckboxState, 1000)();
        });
    });
    
    // Save on page unload
    window.addEventListener('beforeunload', saveCheckboxState);
    
    // Periodic auto-save every 5 minutes
    setInterval(saveCheckboxState, 5 * 60 * 1000);
}

// Debounce function to limit save frequency
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export data function
function exportData() {
    try {
        const data = {
            exportDate: new Date().toISOString(),
            week: getWeekNumber(new Date()),
            shift: document.getElementById('shiftSelect')?.value || 'morning',
            tasks: []
        };
        
        const rows = document.querySelectorAll('tbody tr:not(.section-row)');
        rows.forEach(row => {
            const taskText = row.querySelector('.task-text');
            const timeCell = row.querySelector('.time-cell');
            const durationCell = row.querySelector('.duration-cell');
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            const textarea = row.querySelector('textarea');
            
            if (taskText) {
                const taskData = {
                    task: taskText.textContent.trim(),
                    time: timeCell ? timeCell.textContent.trim() : '',
                    duration: durationCell ? durationCell.textContent.trim() : '',
                    status: {
                        monday: { ok: checkboxes[0]?.checked || false, nok: checkboxes[1]?.checked || false },
                        tuesday: { ok: checkboxes[2]?.checked || false, nok: checkboxes[3]?.checked || false },
                        wednesday: { ok: checkboxes[4]?.checked || false, nok: checkboxes[5]?.checked || false },
                        thursday: { ok: checkboxes[6]?.checked || false, nok: checkboxes[7]?.checked || false },
                        friday: { ok: checkboxes[8]?.checked || false, nok: checkboxes[9]?.checked || false },
                        saturday: { ok: checkboxes[10]?.checked || false, nok: checkboxes[11]?.checked || false }
                    },
                    comments: textarea ? textarea.value : ''
                };
                data.tasks.push(taskData);
            }
        });
        
        // Create and download JSON file
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `agenda_standard_semaine_${data.week}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        updateSaveStatus('saved', 'Données exportées avec succès');
        console.log('Data exported successfully');
    } catch (error) {
        updateSaveStatus('error', 'Erreur lors de l\'export');
        console.error('Error exporting data:', error);
    }
}

// Print function
function printAgenda() {
    saveCheckboxState(); // Save before printing
    updateSaveStatus('saved', 'Données sauvegardées avant impression');
    window.print();
}

// Manual save function
function saveData() {
    try {
        saveCheckboxState();
        updateSaveStatus('saved', 'Données sauvegardées manuellement');
    } catch (error) {
        updateSaveStatus('error', 'Erreur lors de la sauvegarde');
        console.error('Error saving data:', error);
    }
}

// Reset all data
function resetAll() {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible.')) {
        try {
            // Clear localStorage
            localStorage.removeItem('agendaStates');
            localStorage.removeItem('agendaLastSaved');
            localStorage.removeItem('selectedShift');
            
            // Reset all checkboxes
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                const cell = checkbox.closest('td');
                if (cell) {
                    cell.style.backgroundColor = '';
                }
            });
            
            // Reset all textareas
            const textareas = document.querySelectorAll('textarea');
            textareas.forEach(textarea => {
                textarea.value = '';
                textarea.style.backgroundColor = '';
            });
            
            // Reset shift selector
            const shiftSelect = document.getElementById('shiftSelect');
            if (shiftSelect) {
                shiftSelect.value = 'morning';
                updateTimeDisplays('morning');
            }
            
            updateSaveStatus('saved', 'Toutes les données ont été effacées');
            updateProgressBar(); // Update progress after reset
            console.log('All data reset successfully');
        } catch (error) {
            updateSaveStatus('error', 'Erreur lors de la remise à zéro');
            console.error('Error resetting data:', error);
        }
        }
    }
}

// Get completion percentage
function getCompletionPercentage() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    return checkboxes.length > 0 ? Math.round((checkedBoxes.length / checkboxes.length) * 100) : 0;
}

// Add some utility functions to window for potential external access
window.agendaUtils = {
    exportData,
    printAgenda,
    resetAll,
    saveData,
    loadCheckboxStates,
    getCompletionPercentage
};
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
