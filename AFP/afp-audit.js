// AFP Audit Management System
class AFPManager {
    constructor() {
        this.auditData = {
            documentInfo: {
                date: '',
                auditor: '',
                sector: '',
                vehicleFamily: ''
            },
            results: {},
            scores: {
                assemblage_planche: { completed: 0, total: 50, correct: 0, nonCorrect: 0 },
                controle_finition: { completed: 0, total: 53, correct: 0, nonCorrect: 0 }
            }
        };

        this.init();
    }

    init() {
        this.loadFormOptions();
        this.loadSampleData();
        this.renderProgressDashboard();
        this.renderCategories();
        this.setupEventListeners();
        this.updateProgress();
        this.hideLoading();
    }

    loadFormOptions() {
        const auditorSelect = document.getElementById('auditor');
        const sectorSelect = document.getElementById('sector');
        const vehicleFamilySelect = document.getElementById('vehicle-family');

        // Populate auditors
        FORM_OPTIONS.auditors.forEach(auditor => {
            const option = document.createElement('option');
            option.value = auditor;
            option.textContent = auditor;
            auditorSelect.appendChild(option);
        });

        // Populate sectors
        FORM_OPTIONS.sectors.forEach(sector => {
            const option = document.createElement('option');
            option.value = sector;
            option.textContent = sector;
            sectorSelect.appendChild(option);
        });

        // Populate vehicle families
        FORM_OPTIONS.vehicleFamilies.forEach(family => {
            const option = document.createElement('option');
            option.value = family;
            option.textContent = family;
            vehicleFamilySelect.appendChild(option);
        });

        // Set today's date
        document.getElementById('audit-date').value = new Date().toISOString().split('T')[0];
    }

    loadSampleData() {
        // Load sample data for demonstration
        if (SAMPLE_AUDIT_DATA) {
            this.auditData.documentInfo = { ...SAMPLE_AUDIT_DATA.documentInfo };
            this.auditData.results = { ...SAMPLE_AUDIT_DATA.results };
            
            // Populate form with sample data
            document.getElementById('audit-date').value = SAMPLE_AUDIT_DATA.documentInfo.date;
            document.getElementById('auditor').value = SAMPLE_AUDIT_DATA.documentInfo.auditor;
            document.getElementById('sector').value = SAMPLE_AUDIT_DATA.documentInfo.sector;
            document.getElementById('vehicle-family').value = SAMPLE_AUDIT_DATA.documentInfo.vehicleFamily;
        }
    }

    renderProgressDashboard() {
        const container = document.getElementById('progress-cards');
        container.innerHTML = '';

        // Overall progress card
        const overallCard = this.createProgressCard(
            'Overall Progress',
            '📊',
            this.calculateOverallScore(),
            '#3b82f6'
        );
        container.appendChild(overallCard);

        // Category progress cards
        AFP_AUDIT_DATA.categories.forEach(category => {
            const score = this.calculateCategoryScore(category.id);
            const card = this.createProgressCard(
                category.name,
                category.emoji,
                score,
                category.color
            );
            container.appendChild(card);
        });
    }

    createProgressCard(title, emoji, score, color) {
        const card = document.createElement('div');
        card.className = 'progress-card';
        card.style.borderColor = color;

        const progressColor = score >= 90 ? '#22c55e' : score >= 75 ? '#f59e0b' : '#ef4444';

        card.innerHTML = `
            <div class="progress-circle">
                <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="35" stroke="#e5e7eb" stroke-width="6" fill="none"/>
                    <circle cx="40" cy="40" r="35" stroke="${progressColor}" stroke-width="6" 
                            fill="none" stroke-linecap="round"
                            stroke-dasharray="${2 * Math.PI * 35}"
                            stroke-dashoffset="${2 * Math.PI * 35 * (1 - score / 100)}"
                            transform="rotate(-90 40 40)"/>
                    <text x="40" y="35" text-anchor="middle" font-size="12" font-weight="bold" fill="${color}">
                        ${emoji}
                    </text>
                    <text x="40" y="50" text-anchor="middle" font-size="14" font-weight="bold" fill="#374151">
                        ${score}%
                    </text>
                </svg>
            </div>
            <h4>${title}</h4>
            <div class="score">${score}%</div>
        `;

        return card;
    }

    renderCategories() {
        const container = document.getElementById('categories-container');
        container.innerHTML = '';

        AFP_AUDIT_DATA.categories.forEach((category, index) => {
            const categoryElement = this.createCategoryElement(category, index);
            container.appendChild(categoryElement);
        });
    }

    createCategoryElement(category, index) {
        const section = document.createElement('div');
        section.className = 'category-section';

        const completed = this.getCategoryCompleted(category.id);
        const correct = this.getCategoryCorrect(category.id);
        const totalCheckpoints = this.getCategoryTotal(category);
        const score = this.calculateCategoryScore(category.id); // Use dynamic calculation

        section.innerHTML = `
            <div class="category-header" style="background: linear-gradient(135deg, ${category.color}, ${this.darkenColor(category.color, 20)})" 
                 onclick="afpManager.toggleCategory(${index})">
                <div class="category-title">
                    <div class="category-emoji">${category.emoji}</div>
                    <div class="category-info">
                        <h3>${category.name}</h3>
                        <p>${category.description}</p>
                    </div>
                </div>
                <div class="category-stats">
                    <div class="stat-item">
                        <span class="stat-value">${completed}/${totalCheckpoints}</span>
                        <span class="stat-label">Complété</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${score}%</span>
                        <span class="stat-label">Score</span>
                    </div>
                    <div class="category-toggle">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
            </div>
            <div class="category-content ${index === 0 ? 'active' : ''}" id="category-content-${index}">
                <div class="checkpoints-container">
                    ${this.renderCheckpoints(category)}
                </div>
            </div>
        `;

        return section;
    }

    renderCheckpoints(category) {
        let checkpointsHtml = '';
        
        category.subcategories.forEach(subcategory => {
            checkpointsHtml += `
                <div class="subcategory-section">
                    <h4 class="subcategory-title">${subcategory.name}</h4>
                    <div class="subcategory-checkpoints">
                        ${subcategory.checkpoints.map(checkpoint => {
                            const result = this.auditData.results[checkpoint.id] || { correct: false, nonCorrect: false, details: '' };
                            return `
                                <div class="checkpoint-item" data-checkpoint="${checkpoint.id}">
                                    <div class="checkpoint-main">
                                        <div class="checkpoint-text">
                                            <span class="checkpoint-id">${checkpoint.id.toUpperCase()}</span>
                                            ${checkpoint.text}
                                        </div>
                                    </div>
                                    <div class="checkpoint-controls">
                                        <div class="checkbox-group">
                                            <label class="checkbox-option checkbox-correct">
                                                <input type="checkbox" 
                                                       ${result.correct ? 'checked' : ''} 
                                                       onchange="afpManager.updateCheckpoint('${checkpoint.id}', 'correct', this.checked)">
                                                <span>✓ Conforme</span>
                                            </label>
                                            <label class="checkbox-option checkbox-incorrect">
                                                <input type="checkbox" 
                                                       ${result.nonCorrect ? 'checked' : ''} 
                                                       onchange="afpManager.updateCheckpoint('${checkpoint.id}', 'nonCorrect', this.checked)">
                                                <span>✗ Non Conforme</span>
                                            </label>
                                        </div>
                                        <div class="details-section">
                                            <textarea class="details-input" 
                                                      placeholder="Détails sur anomalies relevées / Actions correctives..."
                                                      onchange="afpManager.updateCheckpointDetails('${checkpoint.id}', this.value)">${result.details}</textarea>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        });
        
        return checkpointsHtml;
    }

    toggleCategory(index) {
        const content = document.getElementById(`category-content-${index}`);
        const toggle = content.previousElementSibling.querySelector('.category-toggle');
        
        content.classList.toggle('active');
        toggle.classList.toggle('active');
    }

    updateCheckpoint(checkpointId, type, checked) {
        if (!this.auditData.results[checkpointId]) {
            this.auditData.results[checkpointId] = { correct: false, nonCorrect: false, details: '' };
        }

        // Ensure mutual exclusivity
        if (type === 'correct' && checked) {
            this.auditData.results[checkpointId].correct = true;
            this.auditData.results[checkpointId].nonCorrect = false;
            // Uncheck the non-correct checkbox
            const nonCorrectCheckbox = document.querySelector(`input[name="${checkpointId}-result"][value="non-correct"]`);
            if (nonCorrectCheckbox) nonCorrectCheckbox.checked = false;
        } else if (type === 'nonCorrect' && checked) {
            this.auditData.results[checkpointId].nonCorrect = true;
            this.auditData.results[checkpointId].correct = false;
            // Uncheck the correct checkbox
            const correctCheckbox = document.querySelector(`input[name="${checkpointId}-result"][value="correct"]`);
            if (correctCheckbox) correctCheckbox.checked = false;
        } else {
            this.auditData.results[checkpointId][type] = checked;
        }

        this.updateProgress();
        this.renderProgressDashboard();
        this.updateCategoryHeaders(); // Add this line to update category headers
        this.saveToLocalStorage();
    }

    updateCheckpointDetails(checkpointId, details) {
        if (!this.auditData.results[checkpointId]) {
            this.auditData.results[checkpointId] = { correct: false, nonCorrect: false, details: '' };
        }
        this.auditData.results[checkpointId].details = details;
        this.saveToLocalStorage();
    }

    updateProgress() {
        AFP_AUDIT_DATA.categories.forEach(category => {
            const categoryData = this.auditData.scores[category.id];
            if (categoryData) {
                categoryData.completed = this.getCategoryCompleted(category.id);
                categoryData.correct = this.getCategoryCorrect(category.id);
                categoryData.nonCorrect = this.getCategoryNonCorrect(category.id);
            }
        });
    }

    updateCategoryHeaders() {
        AFP_AUDIT_DATA.categories.forEach((category, index) => {
            const categoryHeader = document.querySelector(`#category-content-${index}`).previousElementSibling;
            const statsElements = categoryHeader.querySelectorAll('.stat-value');
            
            if (statsElements.length >= 2) {
                const completed = this.getCategoryCompleted(category.id);
                const totalCheckpoints = this.getCategoryTotal(category);
                const score = this.calculateCategoryScore(category.id);
                
                // Update completed stat
                statsElements[0].textContent = `${completed}/${totalCheckpoints}`;
                // Update score stat
                statsElements[1].textContent = `${score}%`;
            }
        });
    }

    getCategoryTotal(category) {
        return category.subcategories.reduce((total, subcategory) => 
            total + subcategory.checkpoints.length, 0);
    }

    getCategoryCompleted(categoryId) {
        const category = AFP_AUDIT_DATA.categories.find(c => c.id === categoryId);
        if (!category) return 0;

        let completed = 0;
        category.subcategories.forEach(subcategory => {
            subcategory.checkpoints.forEach(checkpoint => {
                const result = this.auditData.results[checkpoint.id];
                if (result && (result.correct || result.nonCorrect)) {
                    completed++;
                }
            });
        });
        return completed;
    }

    getCategoryCorrect(categoryId) {
        const category = AFP_AUDIT_DATA.categories.find(c => c.id === categoryId);
        if (!category) return 0;

        let correct = 0;
        category.subcategories.forEach(subcategory => {
            subcategory.checkpoints.forEach(checkpoint => {
                const result = this.auditData.results[checkpoint.id];
                if (result && result.correct) {
                    correct++;
                }
            });
        });
        return correct;
    }

    getCategoryNonCorrect(categoryId) {
        const category = AFP_AUDIT_DATA.categories.find(c => c.id === categoryId);
        if (!category) return 0;

        let nonCorrect = 0;
        category.subcategories.forEach(subcategory => {
            subcategory.checkpoints.forEach(checkpoint => {
                const result = this.auditData.results[checkpoint.id];
                if (result && result.nonCorrect) {
                    nonCorrect++;
                }
            });
        });
        return nonCorrect;
    }

    calculateCategoryScore(categoryId) {
        const category = AFP_AUDIT_DATA.categories.find(c => c.id === categoryId);
        if (!category) return 0;

        const correct = this.getCategoryCorrect(categoryId);
        const nonCorrect = this.getCategoryNonCorrect(categoryId);
        const totalAnswered = correct + nonCorrect;
        
        if (totalAnswered === 0) return 0;

        return Math.round((correct / totalAnswered) * 100);
    }

    calculateOverallScore() {
        const totalCorrect = AFP_AUDIT_DATA.categories.reduce((sum, cat) => 
            sum + this.getCategoryCorrect(cat.id), 0);
        
        const totalNonCorrect = AFP_AUDIT_DATA.categories.reduce((sum, cat) => 
            sum + this.getCategoryNonCorrect(cat.id), 0);
        
        const totalAnswered = totalCorrect + totalNonCorrect;
        
        if (totalAnswered === 0) return 0;
        
        return Math.round((totalCorrect / totalAnswered) * 100);
    }

    setupEventListeners() {
        // Document info change listeners
        ['audit-date', 'auditor', 'sector', 'vehicle-family'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    const fieldName = e.target.id.replace('-', '');
                    if (fieldName === 'vehiclefamily') {
                        this.auditData.documentInfo.vehicleFamily = e.target.value;
                    } else {
                        this.auditData.documentInfo[fieldName === 'auditdate' ? 'date' : fieldName] = e.target.value;
                    }
                    this.saveToLocalStorage();
                });
            }
        });
    }

    saveAudit() {
        // Update document info
        this.auditData.documentInfo.date = document.getElementById('audit-date').value;
        this.auditData.documentInfo.auditor = document.getElementById('auditor').value;
        this.auditData.documentInfo.sector = document.getElementById('sector').value;
        this.auditData.documentInfo.vehicleFamily = document.getElementById('vehicle-family').value;

        this.saveToLocalStorage();
        this.showNotification('Audit saved successfully!', 'success');
    }

    exportAudit() {
        const exportData = {
            ...this.auditData,
            timestamp: new Date().toISOString(),
            scores: {
                overall: this.calculateOverallScore(),
                visual: this.calculateCategoryScore('visual'),
                electric: this.calculateCategoryScore('electric'),
                conformity: this.calculateCategoryScore('conformity')
            }
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `AFP_Audit_${this.auditData.documentInfo.date || 'export'}.json`;
        link.click();

        URL.revokeObjectURL(url);
        this.showNotification('Audit data exported successfully!', 'success');
    }

    generateReport() {
        // Simulate PDF generation
        this.showNotification('Generating PDF report...', 'info');
        
        setTimeout(() => {
            this.showNotification('PDF report would be generated here!', 'warning');
        }, 2000);
    }

    saveToLocalStorage() {
        localStorage.setItem('afp-audit-data', JSON.stringify(this.auditData));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('afp-audit-data');
        if (saved) {
            this.auditData = { ...this.auditData, ...JSON.parse(saved) };
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;

        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    hideLoading() {
        document.getElementById('loading').classList.remove('active');
    }
}

// Add slide animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize AFP Manager when page loads
let afpManager;
document.addEventListener('DOMContentLoaded', () => {
    afpManager = new AFPManager();
});
