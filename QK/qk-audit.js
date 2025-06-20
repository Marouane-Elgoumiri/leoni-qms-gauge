// QK Audit - JavaScript Functionality
// LEONI Quality Management System

class QKAuditManager {
    constructor() {
        this.rowCounter = 0;
        this.auditData = {
            productInfo: {},
            metrics: {},
            actions: [],
            corrective: {}
        };
        
        this.init();
    }

    init() {
        this.setCurrentDate();
        this.setupEventListeners();
        this.setupCalculations();
        console.log('🔧 QK Audit Manager initialized');
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dateAudit').value = today;
    }

    setupEventListeners() {
        // Add Action Button
        const addActionBtn = document.getElementById('addActionBtn');
        if (addActionBtn) {
            addActionBtn.addEventListener('click', () => this.addActionRow());
        }

        // Form submission buttons
        const saveBtn = document.getElementById('saveBtn');
        const submitBtn = document.getElementById('submitBtn');
        const previewBtn = document.getElementById('previewBtn');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveAudit());
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitAudit());
        }

        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewAudit());
        }

        // Real-time form validation
        this.setupFormValidation();
    }

    setupCalculations() {
        // Auto-calculate "Défauts à 100 Points"
        const metrics = ['nombreFaisceaux', 'pointsDemerites', 'facteurEvaluation', 'nombreDefauts'];
        
        metrics.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.calculateDefauts100Points());
            }
        });
    }

    setupFormValidation() {
        const requiredFields = document.querySelectorAll('input[required], select[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldContainer = field.closest('.form-group') || field.closest('.metric-card');
        
        // Remove existing error styling
        this.clearFieldError(field);
        
        if (!value && field.hasAttribute('required')) {
            this.showFieldError(field, 'Ce champ est obligatoire');
            return false;
        }
        
        // Specific validations
        if (field.type === 'tel') {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            if (value && !phoneRegex.test(value)) {
                this.showFieldError(field, 'Format de téléphone invalide');
                return false;
            }
        }
        
        if (field.type === 'number') {
            const numValue = parseFloat(value);
            if (value && (isNaN(numValue) || numValue < 0)) {
                this.showFieldError(field, 'Veuillez entrer une valeur numérique positive');
                return false;
            }
        }
        
        return true;
    }

    showFieldError(field, message) {
        field.style.borderColor = 'var(--danger-color)';
        field.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';
        
        // Add error message if not exists
        let errorMsg = field.parentNode.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('small');
            errorMsg.className = 'error-message';
            errorMsg.style.color = 'var(--danger-color)';
            errorMsg.style.fontSize = 'var(--font-size-xs)';
            errorMsg.style.marginTop = '0.25rem';
            field.parentNode.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const errorMsg = field.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    calculateDefauts100Points() {
        const nombreFaisceaux = parseFloat(document.getElementById('nombreFaisceaux').value) || 0;
        const pointsDemerites = parseFloat(document.getElementById('pointsDemerites').value) || 0;
        const facteurEvaluation = parseFloat(document.getElementById('facteurEvaluation').value) || 1;
        const nombreDefauts = parseFloat(document.getElementById('nombreDefauts').value) || 0;

        let defauts100Points = 0;
        
        if (nombreFaisceaux > 0 && facteurEvaluation > 0) {
            // Formula: (Points de démérites × Facteur d'évaluation) / Nombre de faisceaux
            defauts100Points = (pointsDemerites * facteurEvaluation) / nombreFaisceaux;
        }

        document.getElementById('defauts100Points').value = defauts100Points.toFixed(2);
        
        // Update visual indicator
        const field = document.getElementById('defauts100Points');
        if (defauts100Points > 0) {
            field.style.background = 'linear-gradient(135deg, rgba(56, 178, 172, 0.1), rgba(49, 151, 149, 0.05))';
        }
    }

    addActionRow() {
        const tableContainer = document.getElementById('actionsTableContainer');
        const tableBody = document.getElementById('actionsTableBody');
        
        // Show table if hidden
        if (tableContainer.style.display === 'none') {
            tableContainer.style.display = 'block';
            tableContainer.classList.add('fade-in');
        }

        const rowId = `action-row-${++this.rowCounter}`;
        const row = document.createElement('tr');
        row.id = rowId;
        row.className = 'slide-in';
        
        row.innerHTML = `
            <td>
                <input type="text" name="codeDefaut[]" placeholder="Code défaut" required>
            </td>
            <td>
                <select name="typeDefaut[]" required>
                    <option value="">Sélectionner...</option>
                    <option value="DIMENSIONNEL">Dimensionnel</option>
                    <option value="VISUEL">Visuel</option>
                    <option value="FONCTIONNEL">Fonctionnel</option>
                    <option value="ASSEMBLAGE">Assemblage</option>
                    <option value="ISOLATION">Isolation</option>
                    <option value="MARQUAGE">Marquage</option>
                    <option value="FIXATION">Fixation</option>
                    <option value="AUTRE">Autre</option>
                </select>
            </td>
            <td>
                <textarea name="actionAmelioration[]" rows="2" placeholder="Description de l'action d'amélioration" required></textarea>
            </td>
            <td>
                <select name="frequence[]" required>
                    <option value="">Fréquence...</option>
                    <option value="PONCTUEL">Ponctuel</option>
                    <option value="QUOTIDIEN">Quotidien</option>
                    <option value="HEBDOMADAIRE">Hebdomadaire</option>
                    <option value="MENSUEL">Mensuel</option>
                    <option value="TRIMESTRIEL">Trimestriel</option>
                    <option value="PERMANENT">Permanent</option>
                </select>
            </td>
            <td>
                <input type="number" name="pointsDefaut[]" min="0" step="0.1" placeholder="Points" class="points-input" required>
            </td>
            <td>
                <input type="number" name="totalPoints[]" readonly class="total-points-input">
            </td>
            <td class="action-cell">
                <button type="button" class="table-action-btn" onclick="qkAudit.removeActionRow('${rowId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
        
        // Setup calculations for this row
        this.setupRowCalculations(row);
        
        // Update totals
        this.updateTotals();
        
        // Focus on first input
        row.querySelector('input').focus();
        
        console.log(`➕ Added action row: ${rowId}`);
    }

    setupRowCalculations(row) {
        const pointsInput = row.querySelector('.points-input');
        const totalInput = row.querySelector('.total-points-input');
        
        if (pointsInput && totalInput) {
            pointsInput.addEventListener('input', () => {
                const points = parseFloat(pointsInput.value) || 0;
                // For now, total = points (can be modified based on business logic)
                totalInput.value = points.toFixed(1);
                this.updateTotals();
            });
        }
    }

    removeActionRow(rowId) {
        const row = document.getElementById(rowId);
        if (row) {
            // Add removal animation
            row.style.animation = 'fadeOut 0.3s ease';
            
            setTimeout(() => {
                row.remove();
                this.updateTotals();
                
                // Hide table if no rows
                const tableBody = document.getElementById('actionsTableBody');
                if (tableBody.children.length === 0) {
                    document.getElementById('actionsTableContainer').style.display = 'none';
                }
            }, 300);
            
            console.log(`🗑️ Removed action row: ${rowId}`);
        }
    }

    updateTotals() {
        const tableBody = document.getElementById('actionsTableBody');
        const rows = tableBody.querySelectorAll('tr');
        
        let totalActions = rows.length;
        let totalPoints = 0;
        
        rows.forEach(row => {
            const totalInput = row.querySelector('.total-points-input');
            if (totalInput && totalInput.value) {
                totalPoints += parseFloat(totalInput.value) || 0;
            }
        });
        
        // Update display
        document.getElementById('totalActions').textContent = totalActions;
        document.getElementById('totalPoints').textContent = totalPoints.toFixed(1);
        
        // Visual feedback
        const totalPointsElement = document.getElementById('totalPoints');
        if (totalPoints > 0) {
            totalPointsElement.style.color = 'var(--danger-color)';
            totalPointsElement.style.fontWeight = '700';
        } else {
            totalPointsElement.style.color = 'var(--primary-color)';
        }
    }

    collectFormData() {
        const formData = {
            productInfo: {
                pieceDescription: document.getElementById('pieceDescription').value,
                typeVehicule: document.getElementById('typeVehicule').value,
                famille: document.getElementById('famille').value,
                reference: document.getElementById('reference').value,
                indice: document.getElementById('indice').value,
                departement: document.getElementById('departement').value,
                usine: document.getElementById('usine').value,
                auditeur: document.getElementById('auditeur').value,
                tel: document.getElementById('tel').value,
                dateAudit: document.getElementById('dateAudit').value,
                testType: document.querySelector('input[name="testType"]:checked')?.value
            },
            metrics: {
                nombreFaisceaux: document.getElementById('nombreFaisceaux').value,
                pointsDemerites: document.getElementById('pointsDemerites').value,
                facteurEvaluation: document.getElementById('facteurEvaluation').value,
                nombreDefauts: document.getElementById('nombreDefauts').value,
                defauts100Points: document.getElementById('defauts100Points').value
            },
            actions: this.collectActionsData(),
            corrective: {
                actionCorrective: document.getElementById('actionCorrective').value,
                pilotDelai: document.getElementById('pilotDelai').value,
                verification: document.getElementById('verification').value
            }
        };
        
        return formData;
    }

    collectActionsData() {
        const actions = [];
        const tableBody = document.getElementById('actionsTableBody');
        const rows = tableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const action = {
                codeDefaut: row.querySelector('input[name="codeDefaut[]"]')?.value,
                typeDefaut: row.querySelector('select[name="typeDefaut[]"]')?.value,
                actionAmelioration: row.querySelector('textarea[name="actionAmelioration[]"]')?.value,
                frequence: row.querySelector('select[name="frequence[]"]')?.value,
                pointsDefaut: row.querySelector('input[name="pointsDefaut[]"]')?.value,
                totalPoints: row.querySelector('input[name="totalPoints[]"]')?.value
            };
            
            // Only add if at least code and type are filled
            if (action.codeDefaut && action.typeDefaut) {
                actions.push(action);
            }
        });
        
        return actions;
    }

    validateForm() {
        const requiredFields = document.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate test type selection
        const testType = document.querySelector('input[name="testType"]:checked');
        if (!testType) {
            this.showNotification('Veuillez sélectionner un type de test', 'warning');
            isValid = false;
        }
        
        return isValid;
    }

    saveAudit() {
        if (!this.validateForm()) {
            this.showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
            return;
        }
        
        const formData = this.collectFormData();
        
        // Save to localStorage (in production, send to server)
        const auditId = `qk-audit-${Date.now()}`;
        localStorage.setItem(auditId, JSON.stringify(formData));
        localStorage.setItem('lastQKAudit', auditId);
        
        this.showSuccessModal(formData, auditId);
        
        console.log('💾 Audit saved:', formData);
    }

    submitAudit() {
        if (!this.validateForm()) {
            this.showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
            return;
        }
        
        const formData = this.collectFormData();
        formData.status = 'SUBMITTED';
        formData.submittedAt = new Date().toISOString();
        
        // In production, send to server
        const auditId = `qk-audit-${Date.now()}`;
        localStorage.setItem(auditId, JSON.stringify(formData));
        
        this.showNotification('Audit finalisé et soumis avec succès', 'success');
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = '../Agents_onBoarding/aql-onboarding.html';
        }, 2000);
        
        console.log('📋 Audit submitted:', formData);
    }

    previewAudit() {
        const formData = this.collectFormData();
        this.showPreviewModal(formData);
    }

    showSuccessModal(formData, auditId) {
        const modal = document.getElementById('successModal');
        const summary = document.getElementById('auditSummary');
        
        summary.innerHTML = `
            <div class="summary-item">
                <strong>ID Audit:</strong> ${auditId}
            </div>
            <div class="summary-item">
                <strong>Pièce:</strong> ${formData.productInfo.pieceDescription}
            </div>
            <div class="summary-item">
                <strong>Auditeur:</strong> ${formData.productInfo.auditeur}
            </div>
            <div class="summary-item">
                <strong>Date:</strong> ${new Date(formData.productInfo.dateAudit).toLocaleDateString('fr-FR')}
            </div>
            <div class="summary-item">
                <strong>Actions définies:</strong> ${formData.actions.length}
            </div>
            <div class="summary-item">
                <strong>Total points:</strong> ${document.getElementById('totalPoints').textContent}
            </div>
        `;
        
        modal.classList.add('show');
    }

    showPreviewModal(formData) {
        // Create a preview window
        const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
        
        const previewHTML = this.generatePreviewHTML(formData);
        previewWindow.document.write(previewHTML);
        previewWindow.document.close();
    }

    generatePreviewHTML(formData) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Aperçu Audit QK</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .section { margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; }
                    .section h3 { color: #38b2ac; margin-bottom: 10px; }
                    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
                    .info-item { margin-bottom: 5px; }
                    .info-item strong { color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #38b2ac; color: white; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>QK - Audit Produit Faisceaux & Cables</h1>
                    <h2>LEONI Quality Management System</h2>
                </div>
                
                <div class="section">
                    <h3>Informations Produit</h3>
                    <div class="info-grid">
                        <div class="info-item"><strong>Description:</strong> ${formData.productInfo.pieceDescription}</div>
                        <div class="info-item"><strong>Type Véhicule:</strong> ${formData.productInfo.typeVehicule}</div>
                        <div class="info-item"><strong>Famille:</strong> ${formData.productInfo.famille}</div>
                        <div class="info-item"><strong>Référence:</strong> ${formData.productInfo.reference}</div>
                        <div class="info-item"><strong>Indice:</strong> ${formData.productInfo.indice}</div>
                        <div class="info-item"><strong>Département:</strong> ${formData.productInfo.departement}</div>
                        <div class="info-item"><strong>Usine:</strong> ${formData.productInfo.usine}</div>
                        <div class="info-item"><strong>Auditeur:</strong> ${formData.productInfo.auditeur}</div>
                        <div class="info-item"><strong>Téléphone:</strong> ${formData.productInfo.tel}</div>
                        <div class="info-item"><strong>Date:</strong> ${formData.productInfo.dateAudit}</div>
                        <div class="info-item"><strong>Type de Test:</strong> ${formData.productInfo.testType}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h3>Métriques d'Évaluation</h3>
                    <div class="info-grid">
                        <div class="info-item"><strong>Faisceaux Vérifiés:</strong> ${formData.metrics.nombreFaisceaux}</div>
                        <div class="info-item"><strong>Points de Démérites:</strong> ${formData.metrics.pointsDemerites}</div>
                        <div class="info-item"><strong>Facteur d'Évaluation:</strong> ${formData.metrics.facteurEvaluation}</div>
                        <div class="info-item"><strong>Nombre de Défauts:</strong> ${formData.metrics.nombreDefauts}</div>
                        <div class="info-item"><strong>Défauts à 100 Points:</strong> ${formData.metrics.defauts100Points}</div>
                    </div>
                </div>
                
                ${formData.actions.length > 0 ? `
                <div class="section">
                    <h3>Actions d'Amélioration</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Code Défaut</th>
                                <th>Type</th>
                                <th>Action</th>
                                <th>Fréquence</th>
                                <th>Points</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${formData.actions.map(action => `
                                <tr>
                                    <td>${action.codeDefaut}</td>
                                    <td>${action.typeDefaut}</td>
                                    <td>${action.actionAmelioration}</td>
                                    <td>${action.frequence}</td>
                                    <td>${action.pointsDefaut}</td>
                                    <td>${action.totalPoints}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ` : ''}
                
                ${formData.corrective.actionCorrective ? `
                <div class="section">
                    <h3>Actions Correctives</h3>
                    <div class="info-item"><strong>Action Corrective:</strong> ${formData.corrective.actionCorrective}</div>
                    <div class="info-item"><strong>Pilote & Délai:</strong> ${formData.corrective.pilotDelai}</div>
                    <div class="info-item"><strong>Vérification:</strong> ${formData.corrective.verification}</div>
                </div>
                ` : ''}
            </body>
            </html>
        `;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        // Set background color based on type
        const colors = {
            success: 'var(--success-color)',
            error: 'var(--danger-color)',
            warning: 'var(--warning-color)',
            info: 'var(--info-color)'
        };
        notification.style.background = colors[type] || colors.info;
        
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation' : 'info'}-circle"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
}

// Global functions
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
}

// Animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(-20px); }
    }
    
    .notification {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.qkAudit = new QKAuditManager();
});

// Export for global access
window.QKAuditManager = QKAuditManager;
