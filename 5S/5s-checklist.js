// 5S Checklist Management System
class FiveSManager {
    constructor() {
        this.currentDay = 'monday';
        this.weeklyChart = null;
        this.init();
    }

    init() {
        this.ensureDataStructure();
        this.renderCategories();
        this.setupEventListeners();
        this.updateScoreDashboard();
        this.updateProgressCircles();
        this.initWeeklyChart();
        this.loadSavedData();
    }

    setupEventListeners() {
        // Day tab switching
        document.querySelectorAll('.day-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const day = e.target.dataset.day;
                this.switchDay(day);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveAssessment();
            }
        });
    }

    switchDay(day) {
        this.currentDay = day;
        
        // Update active tab
        document.querySelectorAll('.day-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-day="${day}"]`).classList.add('active');
        
        // Update current day display
        document.getElementById('currentDay').textContent = 
            day.charAt(0).toUpperCase() + day.slice(1);
        
        // Re-render categories with current day data
        this.renderCategories();
        this.updateScoreDashboard();
        this.updateProgressCircles();
    }

    renderCategories() {
        const container = document.getElementById('categoriesContainer');
        
        if (!container) {
            console.error('categoriesContainer element not found!');
            return;
        }
        
        if (typeof fiveSCriteria === 'undefined') {
            console.error('fiveSCriteria is not defined!');
            return;
        }
        
        if (typeof categoryInfo === 'undefined') {
            console.error('categoryInfo is not defined!');
            return;
        }
        
        container.innerHTML = '';

        Object.keys(fiveSCriteria).forEach(categoryKey => {
            const category = fiveSCriteria[categoryKey];
            const categoryData = categoryInfo[categoryKey];
            
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.innerHTML = `
                <div class="category-header ${categoryKey}">
                    ${categoryData.icon} ${categoryData.name}
                    <div style="font-size: 12px; font-weight: normal; opacity: 0.9; margin-top: 5px;">
                        ${categoryData.description}
                    </div>
                </div>
                <div class="criteria-list">
                    ${category.map((criterion, index) => `
                        <div class="criterion-item" data-category="${categoryKey}" data-index="${index}">
                            <div class="criterion-text">
                                <strong>${index + 1}.</strong> ${criterion}
                            </div>
                            <div class="criterion-controls">
                                <button class="status-btn status-ok ${this.getButtonState(categoryKey, index, 'ok')}" 
                                        data-category="${categoryKey}" data-index="${index}" data-status="ok"
                                        title="OK">
                                    ✓
                                </button>
                                <button class="status-btn status-not-ok ${this.getButtonState(categoryKey, index, 'not-ok')}" 
                                        data-category="${categoryKey}" data-index="${index}" data-status="not-ok"
                                        title="Not OK">
                                    ✗
                                </button>
                                <button class="status-btn status-na ${this.getButtonState(categoryKey, index, 'na')}" 
                                        data-category="${categoryKey}" data-index="${index}" data-status="na"
                                        title="Not Applicable">
                                    —
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.appendChild(categoryCard);
        });

        // Add event listeners to all status buttons
        this.setupStatusButtonListeners();
    }

    setupStatusButtonListeners() {
        const statusButtons = document.querySelectorAll('.status-btn');
        statusButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                const index = parseInt(e.target.dataset.index);
                const status = e.target.dataset.status;
                this.setCriterionStatus(category, index, status);
            });
        });
    }

    getButtonState(category, index, status) {
        // Safety check to ensure data structure exists
        if (!weeklyScores[this.currentDay] || 
            !weeklyScores[this.currentDay][category] || 
            weeklyScores[this.currentDay][category][index] === undefined) {
            return '';
        }
        
        const currentStatus = weeklyScores[this.currentDay][category][index];
        return currentStatus === status ? 'active' : '';
    }

    setCriterionStatus(category, index, status) {
        // Ensure data structure exists
        if (!weeklyScores[this.currentDay]) {
            weeklyScores[this.currentDay] = {};
        }
        if (!weeklyScores[this.currentDay][category]) {
            weeklyScores[this.currentDay][category] = {};
        }
        
        // Update the data
        weeklyScores[this.currentDay][category][index] = status;
        
        // Update UI
        const criterionItem = document.querySelector(
            `[data-category="${category}"][data-index="${index}"]`
        );
        
        // Reset all buttons in this criterion
        criterionItem.querySelectorAll('.status-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Activate the selected button
        const targetBtn = criterionItem.querySelector(`.status-${status}`);
        targetBtn.classList.add('active');
        
        // Add visual feedback
        criterionItem.style.borderLeftColor = this.getStatusColor(status);
        criterionItem.style.backgroundColor = this.getStatusBackgroundColor(status);
        
        // Update scores and progress
        this.updateScoreDashboard();
        this.updateProgressCircles();
        this.updateWeeklyChart();
        
        // Auto-save
        this.autoSave();
    }

    getStatusColor(status) {
        const colors = {
            'ok': '#38a169',
            'not-ok': '#e53e3e',
            'na': '#a0aec0'
        };
        return colors[status] || '#e2e8f0';
    }

    getStatusBackgroundColor(status) {
        const colors = {
            'ok': '#f0fff4',
            'not-ok': '#fed7d7',
            'na': '#f7fafc'
        };
        return colors[status] || '#f8fafc';
    }

    calculateDayScore(day) {
        // Safety check for data structure
        if (!weeklyScores[day]) {
            return {
                score: 0,
                ok: 0,
                notOk: 0,
                na: 0,
                total: 0
            };
        }
        
        const dayData = weeklyScores[day];
        let totalOk = 0;
        let totalNotOk = 0;
        let totalNA = 0;
        
        Object.keys(dayData).forEach(category => {
            if (dayData[category]) {
                Object.keys(dayData[category]).forEach(index => {
                    const status = dayData[category][index];
                    if (status === 'ok') totalOk++;
                    else if (status === 'not-ok') totalNotOk++;
                    else if (status === 'na') totalNA++;
                });
            }
        });
        
        // Calculate score: T = (A - NotA) / (A + B) * 100
        // where A = OK, NotA = NOT OK, B = NOT OK (so A + B = OK + NOT OK)
        const denominator = totalOk + totalNotOk;
        const score = denominator > 0 ? ((totalOk - totalNotOk) / denominator) * 100 : 0;
        
        return {
            score: Math.max(0, Math.round(score)), // Ensure score is not negative
            ok: totalOk,
            notOk: totalNotOk,
            na: totalNA,
            total: totalOk + totalNotOk + totalNA
        };
    }

    calculateCategoryScore(category, day) {
        // Safety check for data structure
        if (!weeklyScores[day] || !weeklyScores[day][category]) {
            return {
                score: 0,
                ok: 0,
                notOk: 0,
                na: 0,
                total: 0
            };
        }
        
        const categoryData = weeklyScores[day][category];
        let ok = 0;
        let notOk = 0;
        let na = 0;
        
        Object.keys(categoryData).forEach(index => {
            const status = categoryData[index];
            if (status === 'ok') ok++;
            else if (status === 'not-ok') notOk++;
            else if (status === 'na') na++;
        });
        
        const denominator = ok + notOk;
        const score = denominator > 0 ? ((ok - notOk) / denominator) * 100 : 0;
        
        return {
            score: Math.max(0, Math.round(score)),
            ok,
            notOk,
            na,
            total: ok + notOk + na
        };
    }

    updateScoreDashboard() {
        const dayScore = this.calculateDayScore(this.currentDay);
        
        document.getElementById('okCount').textContent = dayScore.ok;
        document.getElementById('notOkCount').textContent = dayScore.notOk;
        document.getElementById('naCount').textContent = dayScore.na;
        document.getElementById('totalScore').textContent = dayScore.score + '%';
        
        // Add color coding to total score
        const totalScoreElement = document.getElementById('totalScore');
        const scoreCard = totalScoreElement.closest('.score-card');
        
        if (dayScore.score >= 90) {
            scoreCard.style.background = 'linear-gradient(135deg, #38a169, #2f855a)';
        } else if (dayScore.score >= 75) {
            scoreCard.style.background = 'linear-gradient(135deg, #d69e2e, #b7791f)';
        } else {
            scoreCard.style.background = 'linear-gradient(135deg, #e53e3e, #c53030)';
        }
    }

    updateProgressCircles() {
        const circumference = 2 * Math.PI * 40; // radius = 40
        
        Object.keys(categoryInfo).forEach(category => {
            const categoryScore = this.calculateCategoryScore(category, this.currentDay);
            const percentage = categoryScore.score;
            
            // Update progress circle
            const progressFill = document.querySelector(`.${category}-progress`);
            const offset = circumference - (percentage / 100) * circumference;
            progressFill.style.strokeDasharray = `${circumference} ${circumference}`;
            progressFill.style.strokeDashoffset = offset;
            
            // Update percentage text
            document.getElementById(`${category}Progress`).textContent = percentage + '%';
        });
    }

    initWeeklyChart() {
        const ctx = document.getElementById('weeklyChart').getContext('2d');
        
        // Calculate current week scores
        const currentWeekData = Object.keys(weeklyScores).map(day => {
            return this.calculateDayScore(day).score;
        });
        
        // Update the historical data with current week
        const chartData = { ...historicalData };
        chartData.datasets.forEach((dataset, index) => {
            if (index < currentWeekData.length) {
                dataset.data[4] = currentWeekData[index]; // Update current week data
            }
        });
        
        this.weeklyChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '5S Score Trends',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Score (%)'
                        }
                    }
                },
                elements: {
                    line: {
                        borderWidth: 3
                    },
                    point: {
                        radius: 5,
                        hoverRadius: 8
                    }
                }
            }
        });
    }

    updateWeeklyChart() {
        if (!this.weeklyChart) return;
        
        const currentWeekData = Object.keys(weeklyScores).map(day => {
            return this.calculateDayScore(day).score;
        });
        
        this.weeklyChart.data.datasets.forEach((dataset, index) => {
            if (index < currentWeekData.length) {
                dataset.data[4] = currentWeekData[index];
            }
        });
        
        this.weeklyChart.update();
    }

    saveAssessment() {
        try {
            localStorage.setItem('leoni_5s_data', JSON.stringify(weeklyScores));
            this.showNotification('Assessment saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving assessment:', error);
            this.showNotification('Error saving assessment', 'error');
        }
    }

    loadSavedData() {
        try {
            const savedData = localStorage.getItem('leoni_5s_data');
            if (savedData) {
                weeklyScores = JSON.parse(savedData);
                // Don't re-render categories here - just update the UI state
                this.updateScoreDashboard();
                this.updateProgressCircles();
                this.updateWeeklyChart();
                // Update button states to reflect loaded data
                this.updateButtonStates();
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }

    autoSave() {
        // Auto-save after each change with debouncing
        clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            this.saveAssessment();
        }, 1000);
    }

    resetDay() {
        if (confirm(`Are you sure you want to reset all assessments for ${this.currentDay}?`)) {
            Object.keys(fiveSCriteria).forEach(category => {
                fiveSCriteria[category].forEach((criterion, index) => {
                    weeklyScores[this.currentDay][category][index] = null;
                });
            });
            
            this.renderCategories();
            this.updateScoreDashboard();
            this.updateProgressCircles();
            this.updateWeeklyChart();
            this.showNotification(`${this.currentDay} assessment reset`, 'success');
        }
    }

    exportData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            weeklyScores: weeklyScores,
            summary: this.generateSummary()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `LEONI_5S_Assessment_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        
        this.showNotification('Assessment data exported!', 'success');
    }

    generateSummary() {
        const summary = {};
        
        Object.keys(weeklyScores).forEach(day => {
            const dayScore = this.calculateDayScore(day);
            summary[day] = {
                totalScore: dayScore.score,
                ok: dayScore.ok,
                notOk: dayScore.notOk,
                na: dayScore.na,
                categories: {}
            };
            
            Object.keys(categoryInfo).forEach(category => {
                const categoryScore = this.calculateCategoryScore(category, day);
                summary[day].categories[category] = categoryScore;
            });
        });
        
        return summary;
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${type === 'success' ? '✅' : '❌'}</span>
                <span>${message}</span>
            </div>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '2000',
            transform: 'translateX(400px)',
            transition: 'all 0.3s ease',
            background: type === 'success' 
                ? 'linear-gradient(135deg, #38a169, #2f855a)'
                : 'linear-gradient(135deg, #e53e3e, #c53030)'
        });
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    updateButtonStates() {
        // Update button states based on current data without re-rendering
        Object.keys(fiveSCriteria).forEach(categoryKey => {
            fiveSCriteria[categoryKey].forEach((criterion, index) => {
                const criterionItem = document.querySelector(
                    `[data-category="${categoryKey}"][data-index="${index}"]`
                );
                
                if (criterionItem) {
                    // Reset all buttons
                    criterionItem.querySelectorAll('.status-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // Activate the correct button based on saved data
                    const currentStatus = weeklyScores[this.currentDay]?.[categoryKey]?.[index];
                    if (currentStatus) {
                        const targetBtn = criterionItem.querySelector(`.status-${currentStatus}`);
                        if (targetBtn) {
                            targetBtn.classList.add('active');
                        }
                    }
                }
            });
        });
    }

    // Ensure weeklyScores data structure is properly initialized
    ensureDataStructure() {
        Object.keys(weeklyScores).forEach(day => {
            if (!weeklyScores[day]) {
                weeklyScores[day] = {};
            }
            Object.keys(fiveSCriteria).forEach(category => {
                if (!weeklyScores[day][category]) {
                    weeklyScores[day][category] = {};
                }
                fiveSCriteria[category].forEach((criterion, index) => {
                    if (weeklyScores[day][category][index] === undefined) {
                        weeklyScores[day][category][index] = null; // null = not assessed
                    }
                });
            });
        });
    }
}

// Global functions for button clicks
function saveAssessment() {
    fiveSManager.saveAssessment();
}

function resetDay() {
    fiveSManager.resetDay();
}

function exportData() {
    fiveSManager.exportData();
}

// Initialize the 5S Manager when DOM is loaded
let fiveSManager;
document.addEventListener('DOMContentLoaded', function() {
    fiveSManager = new FiveSManager();
});