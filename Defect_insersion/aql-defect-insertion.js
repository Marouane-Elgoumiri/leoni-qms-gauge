// JavaScript for AQL Defect Insertion Form

// Mock data for defect codes with auto-suggestions
const defectCodes = {
    'CD001': 'Wire Cut/Damaged',
    'CD002': 'Terminal Crimp Defect',
    'CD003': 'Connector Assembly Error',
    'CD004': 'Pin Insertion Failure',
    'CD005': 'Tape Wrapping Issue',
    'CD006': 'Protective Cover Missing',
    'CD007': 'Label Placement Error',
    'CD008': 'Visual Inspection Fail',
    'CD009': 'Electrical Test Failure',
    'CD010': 'Packaging Defect',
    'CD011': 'Wrong Wire Color',
    'CD012': 'Incorrect Wire Length',
    'CD013': 'Missing Terminal',
    'CD014': 'Bent Terminal',
    'CD015': 'Insulation Damage',
    'CD016': 'Contamination Found',
    'CD017': 'Dimension Out of Spec',
    'CD018': 'Connector Orientation Error',
    'CD019': 'Shield/Screen Issue',
    'CD020': 'Splice Connection Defect'
};

// Global variables for workflow management
let currentDefectStatus = 'pending';
let workflowData = {};

// Initialize form on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupFormValidation();
    setupCodeDefectAutocomplete();
    loadDraftData();
    setupAutoSave();
    setupSmartNavigation();
});

function initializeForm() {
    // Set current date and time
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('defect-datetime').value = localDateTime;
    
    // Initialize workflow status
    updateWorkflowStatus();
}

// Setup autocomplete for defect codes
function setupCodeDefectAutocomplete() {
    const codeInput = document.getElementById('code-defect');
    const nameInput = document.getElementById('defect-name');
    const suggestionsContainer = document.getElementById('code-suggestions');
    
    codeInput.addEventListener('input', function() {
        const value = this.value.toUpperCase();
        nameInput.value = ''; // Clear name field
        
        if (value.length === 0) {
            hideSuggestions();
            return;
        }
        
        // Filter suggestions based on input
        const filteredCodes = Object.keys(defectCodes).filter(code => 
            code.includes(value) || defectCodes[code].toLowerCase().includes(value.toLowerCase())
        );
        
        if (filteredCodes.length > 0) {
            showSuggestions(filteredCodes, value);
        } else {
            hideSuggestions();
        }
        
        // Auto-fill if exact match
        if (defectCodes[value]) {
            nameInput.value = defectCodes[value];
            hideSuggestions();
        }
    });
    
    codeInput.addEventListener('blur', function() {
        // Delay hiding suggestions to allow for clicks
        setTimeout(() => hideSuggestions(), 200);
    });
    
    codeInput.addEventListener('keydown', function(e) {
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
        const activeSuggestion = suggestionsContainer.querySelector('.suggestion-item.active');
        
        if (suggestions.length === 0) return;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const next = activeSuggestion ? activeSuggestion.nextElementSibling : suggestions[0];
                updateActiveSuggestion(next || suggestions[0]);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                const prev = activeSuggestion ? activeSuggestion.previousElementSibling : suggestions[suggestions.length - 1];
                updateActiveSuggestion(prev || suggestions[suggestions.length - 1]);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (activeSuggestion) {
                    selectSuggestion(activeSuggestion.dataset.code);
                }
                break;
                
            case 'Escape':
                hideSuggestions();
                break;
        }
    });
}

function showSuggestions(codes, searchTerm) {
    const suggestionsContainer = document.getElementById('code-suggestions');
    suggestionsContainer.innerHTML = '';
    
    codes.slice(0, 8).forEach((code, index) => {
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion-item';
        suggestion.dataset.code = code;
        
        // Highlight matching text
        const codeText = highlightMatch(code, searchTerm);
        const nameText = highlightMatch(defectCodes[code], searchTerm);
        
        suggestion.innerHTML = `
            <div class="suggestion-code">${codeText}</div>
            <div class="suggestion-name">${nameText}</div>
        `;
        
        suggestion.addEventListener('click', () => selectSuggestion(code));
        suggestion.addEventListener('mouseenter', () => updateActiveSuggestion(suggestion));
        
        suggestionsContainer.appendChild(suggestion);
    });
    
    suggestionsContainer.style.display = 'block';
    
    // Auto-select first suggestion
    if (codes.length > 0) {
        updateActiveSuggestion(suggestionsContainer.firstElementChild);
    }
}

function hideSuggestions() {
    const suggestionsContainer = document.getElementById('code-suggestions');
    suggestionsContainer.style.display = 'none';
}

function updateActiveSuggestion(suggestion) {
    const suggestionsContainer = document.getElementById('code-suggestions');
    suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (suggestion) {
        suggestion.classList.add('active');
        suggestion.scrollIntoView({ block: 'nearest' });
    }
}

function selectSuggestion(code) {
    const codeInput = document.getElementById('code-defect');
    const nameInput = document.getElementById('defect-name');
    
    codeInput.value = code;
    nameInput.value = defectCodes[code];
    hideSuggestions();
    
    // Trigger validation
    validateField({ target: codeInput });
    validateField({ target: nameInput });
    checkFormCompletion();
}

function highlightMatch(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Smart Navigation - Context-aware dashboard links
function setupSmartNavigation() {
    const productionLineSelect = document.getElementById('production-line');
    
    productionLineSelect.addEventListener('change', function() {
        updateNavigationContext(this.value);
    });
}

function updateNavigationContext(selectedLine) {
    if (selectedLine === 'VCE-LINE') {
        showContextualMessage('VCE Line Selected', 'Defect will be tracked in VCE Production Dashboard');
    } else if (selectedLine && selectedLine !== '') {
        showContextualMessage('Production Line Selected', `Defect will be tracked for ${selectedLine}`);
    }
}

function showContextualMessage(title, message) {
    // Create or update contextual message
    let contextMsg = document.getElementById('contextualMessage');
    if (!contextMsg) {
        contextMsg = document.createElement('div');
        contextMsg.id = 'contextualMessage';
        contextMsg.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(contextMsg);
    }
    
    contextMsg.innerHTML = `<strong>${title}:</strong><br>${message}`;
    
    // Animate in
    setTimeout(() => {
        contextMsg.style.opacity = '1';
        contextMsg.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        contextMsg.style.opacity = '0';
        contextMsg.style.transform = 'translateX(100%)';
    }, 3000);
}

function setupFormValidation() {
    const requiredFields = [
        'defect-datetime', 'code-defect', 'defect-type', 'operator-id',
        'project', 'box-number', 'supervisor', 'production-line', 'post-station'
    ];

    // Add real-time validation
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', validateField);
            field.addEventListener('change', validateField);
        }
    });

    // Overall form validation check
    document.getElementById('aqlDefectForm').addEventListener('input', checkFormCompletion);
}

function validateField(event) {
    const field = event.target;
    const isValid = field.value.trim() !== '';
    
    if (isValid) {
        field.style.borderColor = '#10b981';
        field.style.backgroundColor = '#f0fff4';
    } else {
        field.style.borderColor = '#fb923c';
        field.style.backgroundColor = '#fef3f2';
    }
}

function checkFormCompletion() {
    const requiredFields = [
        'defect-datetime', 'code-defect', 'defect-type', 'operator-id',
        'project', 'box-number', 'supervisor', 'production-line', 'post-station'
    ];

    const allFilled = requiredFields.every(fieldId => {
        const field = document.getElementById(fieldId);
        return field && field.value.trim() !== '';
    });

    // Update submit button state
    const submitBtn = document.querySelector('.btn-submit-defect');
    if (allFilled) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.innerHTML = '📝 Submit Defect Report (Ready)';
    } else {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        submitBtn.innerHTML = '📝 Submit Defect Report (Complete required fields)';
    }
}

function submitDefect() {
    const form = document.getElementById('aqlDefectForm');
    
    // Comprehensive validation (comments are now optional)
    if (!validateAllFields()) {
        showValidationError();
        return;
    }

    // Collect comprehensive form data
    const defectData = collectFormData();
    
    // Simulate API submission
    submitToDatabase(defectData);
    
    // Update UI and workflow status
    showSuccessMessage(defectData);
    updateWorkflowStatus('submitted');
    enableQRQCCreation(defectData);
    
    // Store data for QRQC integration
    sessionStorage.setItem('currentDefectData', JSON.stringify(defectData));
    localStorage.setItem('lastSubmittedDefect', JSON.stringify(defectData));
    
    // Clear draft data
    localStorage.removeItem('aqlDefectDraft');
}

function validateAllFields() {
    const requiredFields = [
        'defect-datetime', 'code-defect', 'defect-type', 'operator-id',
        'project', 'box-number', 'supervisor', 'production-line', 'post-station'
    ];

    return requiredFields.every(fieldId => {
        const field = document.getElementById(fieldId);
        return field && field.value.trim() !== '';
    });
}

function collectFormData() {
    const now = new Date();
    const defectId = `AQL-DEF-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${Date.now().toString().slice(-6)}`;
    
    return {
        // Auto-generated fields
        defectId: defectId,
        aqlInspector: document.getElementById('aql-inspector').value,
        submittedAt: new Date().toISOString(),
        
        // User input fields
        datetime: document.getElementById('defect-datetime').value,
        codeDefect: document.getElementById('code-defect').value,
        defectName: document.getElementById('defect-name').value,
        defectType: document.getElementById('defect-type').value,
        operatorId: document.getElementById('operator-id').value,
        project: document.getElementById('project').value,
        boxNumber: document.getElementById('box-number').value,
        supervisor: document.getElementById('supervisor').value,
        productionLine: document.getElementById('production-line').value,
        postStation: document.getElementById('post-station').value,
        comments: document.getElementById('defect-comments').value || '', // Optional
        
        // Additional metadata
        status: 'submitted',
        requiresQRQC: true,
        priority: getPriorityFromDefectType(document.getElementById('defect-type').value)
    };
}

function getPriorityFromDefectType(defectType) {
    const priorityMap = {
        'Critical': 'High',
        'Major': 'High',
        'Minor': 'Medium',
        'Dimensional': 'Medium',
        'Visual': 'Low',
        'Functional': 'High'
    };
    return priorityMap[defectType] || 'Medium';
}

function submitToDatabase(defectData) {
    // Simulate API call to database
    console.log('🔄 Submitting defect to database...', defectData);
    
    // In a real implementation, this would be an actual API call:
    // fetch('/api/defects', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(defectData)
    // });
}

function showSuccessMessage(defectData) {
    const successMessage = document.getElementById('successMessage');
    const defectIdDisplay = document.getElementById('defectIdDisplay');
    
    defectIdDisplay.innerHTML = `
        <strong>Defect ID:</strong> ${defectData.defectId}<br>
        <strong>Priority:</strong> ${defectData.priority}<br>
        <strong>Status:</strong> Awaiting QRQC Creation
    `;
    
    successMessage.classList.add('show');
    successMessage.scrollIntoView({ behavior: 'smooth' });
}

function showValidationError() {
    alert('❌ Please complete all required fields:\n\n' +
          '• Date & Time\n' +
          '• Code Defect\n' +
          '• Defect Type\n' +
          '• Operator ID\n' +
          '• Project\n' +
          '• Box/Batch Number\n' +
          '• Supervisor\n' +
          '• Production Line\n' +
          '• Post/Station\n\n' +
          'Note: Comments are optional');
}

function updateWorkflowStatus(status = 'pending') {
    currentDefectStatus = status;
    
    // Update visual indicators and button states based on status
    const submitBtn = document.querySelector('.btn-submit-defect');
    const qrqcBtn = document.getElementById('createQrqcBtn');
    
    switch(status) {
        case 'pending':
            submitBtn.disabled = !validateAllFields();
            qrqcBtn.disabled = true;
            qrqcBtn.textContent = '📋 Create QRQC Document (Submit defect first)';
            break;
            
        case 'submitted':
            submitBtn.disabled = true;
            submitBtn.textContent = '✅ Defect Submitted Successfully';
            qrqcBtn.disabled = false;
            qrqcBtn.textContent = '📋 Create QRQC Document';
            qrqcBtn.style.background = 'linear-gradient(135deg, #059669, #16a34a)';
            break;
            
        case 'qrqc_created':
            qrqcBtn.textContent = '✅ QRQC Document Created';
            qrqcBtn.disabled = true;
            break;
    }
}

function enableQRQCCreation(defectData) {
    const qrqcBtn = document.getElementById('createQrqcBtn');
    qrqcBtn.disabled = false;
    qrqcBtn.style.opacity = '1';
    qrqcBtn.style.cursor = 'pointer';
}

function createQRQC() {
    const defectData = JSON.parse(sessionStorage.getItem('currentDefectData'));
    
    if (!defectData) {
        alert('❌ No defect data found. Please submit a defect first.');
        return;
    }

    // Prepare QRQC data with defect pre-population
    const qrqcData = {
        defectId: defectData.defectId,
        createdFrom: 'AQL_DEFECT_INSERTION',
        project: defectData.project,
        operator: defectData.operatorId,
        supervisor: defectData.supervisor,
        productionLine: defectData.productionLine,
        postStation: defectData.postStation,
        defectDescription: `${defectData.codeDefect}: ${defectData.defectName}`,
        rootCauseHypothesis: defectData.comments,
        priority: defectData.priority,
        createdAt: new Date().toISOString(),
        dashboardContext: defectData.productionLine === 'VCE-LINE' ? 'VCE_DASHBOARD' : 'GENERAL_DASHBOARD'
    };

    // Store QRQC pre-fill data
    sessionStorage.setItem('qrqcPreFillData', JSON.stringify(qrqcData));
    
    // Update workflow status
    updateWorkflowStatus('qrqc_created');
    
    // Determine appropriate dashboard link for follow-up
    const dashboardLink = defectData.productionLine === 'VCE-LINE' 
        ? '../graphs/DashPerLine/vce-dashboard.html' 
        : '../graphs/dashboard.html';
    
    const dashboardName = defectData.productionLine === 'VCE-LINE' 
        ? 'VCE Production Dashboard' 
        : 'Quality Overview Dashboard';
    
    // Show enhanced confirmation with navigation options
    const proceed = confirm(
        '🔄 Ready to Create QRQC Document\n\n' +
        `Defect ID: ${defectData.defectId}\n` +
        `Production Line: ${defectData.productionLine}\n` +
        `Project: ${defectData.project}\n` +
        `Priority: ${defectData.priority}\n\n` +
        'The QRQC form will be pre-filled with defect data.\n' +
        `After QRQC completion, you can track this defect in the ${dashboardName}.\n\n` +
        'Click OK to proceed to QRQC creation.'
    );
    
    if (proceed) {
        // Store dashboard context for post-QRQC navigation
        sessionStorage.setItem('postQrqcDashboard', dashboardLink);
        sessionStorage.setItem('postQrqcDashboardName', dashboardName);
        
        // Navigate to QRQC form with context parameters
        window.location.href = `../Analysis/qrqc.html?source=aql_defect&defect_id=${defectData.defectId}&line=${defectData.productionLine}&priority=${defectData.priority}`;
    }
}

// Auto-save functionality
function setupAutoSave() {
    let autoSaveTimer;
    const form = document.getElementById('aqlDefectForm');
    
    form.addEventListener('input', function() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(function() {
            saveDraft();
        }, 2000); // Auto-save after 2 seconds of inactivity
    });
}

function saveDraft() {
    const formData = new FormData(document.getElementById('aqlDefectForm'));
    const data = Object.fromEntries(formData);
    data['defect-comments'] = document.getElementById('defect-comments').value;
    data['lastSaved'] = new Date().toISOString();
    
    localStorage.setItem('aqlDefectDraft', JSON.stringify(data));
    console.log('📁 Draft auto-saved at', new Date().toLocaleTimeString());
}

function loadDraftData() {
    const draft = localStorage.getItem('aqlDefectDraft');
    if (draft) {
        const data = JSON.parse(draft);
        const confirmed = window.confirm(
            '📋 Draft data found!\n\n' +
            `Last saved: ${new Date(data.lastSaved).toLocaleString()}\n\n` +
            'Would you like to restore your previous work?'
        );
        
        if (confirmed) {
            Object.keys(data).forEach(key => {
                const element = document.getElementById(key);
                if (element && key !== 'aql-inspector' && key !== 'lastSaved') {
                    element.value = data[key];
                    
                    // Trigger autocomplete for code defect
                    if (key === 'code-defect' && defectCodes[data[key]]) {
                        document.getElementById('defect-name').value = defectCodes[data[key]];
                    }
                }
            });
            
            // Trigger validation check
            checkFormCompletion();
        }
    }
}

// Keyboard shortcuts for efficiency
document.addEventListener('keydown', function(e) {
    // Ctrl+S to save draft
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveDraft();
        showContextualMessage('Draft Saved', 'Your work has been saved locally');
    }
    
    // Ctrl+Enter to submit form
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        if (!document.querySelector('.btn-submit-defect').disabled) {
            submitDefect();
        }
    }
});

// Initial form completion check
window.addEventListener('load', function() {
    setTimeout(checkFormCompletion, 500);
});
