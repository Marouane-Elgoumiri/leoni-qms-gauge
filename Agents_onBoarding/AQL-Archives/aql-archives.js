// AQL Archives - JavaScript Functionality
// LEONI Quality Management System

class AQLArchiveManager {
    constructor() {
        this.archives = [];
        this.filteredArchives = [];
        this.selectedItems = new Set();
        this.currentView = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMockData();
        this.updateStatistics();
        this.renderResults();
        console.log('🗄️ AQL Archive Manager initialized');
    }

    setupEventListeners() {
        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const resetBtn = document.getElementById('resetBtn');
        const exportAllBtn = document.getElementById('exportAllBtn');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }

        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', () => this.exportAllResults());
        }

        // Select all checkbox
        const selectAllCheckbox = document.getElementById('selectAll');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
        }

        // Bulk actions
        const bulkViewBtn = document.getElementById('bulkViewBtn');
        const bulkPrintBtn = document.getElementById('bulkPrintBtn');
        const bulkExportBtn = document.getElementById('bulkExportBtn');

        if (bulkViewBtn) {
            bulkViewBtn.addEventListener('click', () => this.bulkView());
        }

        if (bulkPrintBtn) {
            bulkPrintBtn.addEventListener('click', () => this.bulkPrint());
        }

        if (bulkExportBtn) {
            bulkExportBtn.addEventListener('click', () => this.bulkExport());
        }

        // Modal functionality
        const printModalBtn = document.getElementById('printModalBtn');
        const exportModalBtn = document.getElementById('exportModalBtn');
        const confirmPrintBtn = document.getElementById('confirmPrintBtn');

        if (printModalBtn) {
            printModalBtn.addEventListener('click', () => this.showPrintModal());
        }

        if (exportModalBtn) {
            exportModalBtn.addEventListener('click', () => this.exportCurrentView());
        }

        if (confirmPrintBtn) {
            confirmPrintBtn.addEventListener('click', () => this.confirmPrint());
        }
    }

    loadMockData() {
        // Mock archive data for demonstration
        this.archives = [
            {
                id: 'ARC001',
                date: '2025-06-20',
                type: '5s',
                reference: '5S-WS-001',
                auditeur: 'Mohammed Bennani',
                productionLine: 'HDEP-C1',
                score: '92%',
                status: 'completed',
                data: {
                    workspaceAreas: ['Prébloc', 'Assemblage', 'Test Électrique', 'Contrôle Final'],
                    totalCriteria: 60,
                    okCount: 55,
                    notOkCount: 3,
                    naCount: 2,
                    improvements: 'Amélioration du rangement des outils zone Prébloc'
                }
            },
            {
                id: 'ARC002',
                date: '2025-06-19',
                type: 'afp',
                reference: 'AFP-AUD-024',
                auditeur: 'Fatima El Mansouri',
                productionLine: 'VCE',
                score: '87%',
                status: 'validated',
                data: {
                    checkpoints: 100,
                    passedChecks: 87,
                    failedChecks: 13,
                    criticalIssues: 2,
                    recommendations: 'Renforcement des contrôles de qualité soudure'
                }
            },
            {
                id: 'ARC003',
                date: '2025-06-18',
                type: 'tram',
                reference: 'TRAM-RPT-156',
                auditeur: 'Ahmed Zouari',
                productionLine: 'HDEP-C2',
                score: '156 PPM',
                status: 'completed',
                data: {
                    scrapWeight: 45.6,
                    reworkCount: 12,
                    totalProduction: 2840,
                    defectRate: 0.42,
                    ppmCalculation: 156
                }
            },
            {
                id: 'ARC004',
                date: '2025-06-17',
                type: 'qk',
                reference: 'QK-AUD-089',
                auditeur: 'Leila Hajji',
                productionLine: 'MDEP',
                score: '94%',
                status: 'validated',
                data: {
                    pieceDescription: 'Faisceau moteur VOLVO XC90',
                    typeVehicule: 'VOLVO_XC90',
                    nombreFaisceaux: 50,
                    pointsDemerites: 3.2,
                    nombreDefauts: 2,
                    actionsAmelioration: 'Amélioration du process de sertissage'
                }
            },
            {
                id: 'ARC005',
                date: '2025-06-16',
                type: '5s',
                reference: '5S-WS-002',
                auditeur: 'Karim Nasri',
                productionLine: 'HAULER',
                score: '88%',
                status: 'completed',
                data: {
                    workspaceAreas: ['Prébloc', 'Assemblage'],
                    totalCriteria: 40,
                    okCount: 35,
                    notOkCount: 4,
                    naCount: 1,
                    improvements: 'Marquage au sol et organisation outils'
                }
            },
            {
                id: 'ARC006',
                date: '2025-06-15',
                type: 'afp',
                reference: 'AFP-AUD-025',
                auditeur: 'Nadia Slimani',
                productionLine: 'HDEP-C3',
                score: '91%',
                status: 'archived',
                data: {
                    checkpoints: 85,
                    passedChecks: 77,
                    failedChecks: 8,
                    criticalIssues: 1,
                    recommendations: 'Formation équipe sur nouveaux standards'
                }
            }
        ];

        // Set initial filtered archives
        this.filteredArchives = [...this.archives];
    }

    performSearch() {
        const auditType = document.getElementById('auditType').value;
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const productionLine = document.getElementById('productionLine').value;
        const auditeur = document.getElementById('auditeur').value.toLowerCase();
        const status = document.getElementById('status').value;

        this.showLoading(true);

        setTimeout(() => {
            this.filteredArchives = this.archives.filter(archive => {
                let matches = true;

                if (auditType && archive.type !== auditType) matches = false;
                if (dateFrom && archive.date < dateFrom) matches = false;
                if (dateTo && archive.date > dateTo) matches = false;
                if (productionLine && archive.productionLine !== productionLine) matches = false;
                if (auditeur && !archive.auditeur.toLowerCase().includes(auditeur)) matches = false;
                if (status && archive.status !== status) matches = false;

                return matches;
            });

            this.renderResults();
            this.updateStatistics();
            this.showLoading(false);
            this.showSuccessMessage(`Found ${this.filteredArchives.length} archive(s)`);
        }, 1000);
    }

    resetFilters() {
        document.getElementById('auditType').value = '';
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        document.getElementById('productionLine').value = '';
        document.getElementById('auditeur').value = '';
        document.getElementById('status').value = '';

        this.filteredArchives = [...this.archives];
        this.renderResults();
        this.updateStatistics();
        this.showSuccessMessage('Filters reset successfully');
    }

    renderResults() {
        const tableBody = document.getElementById('resultsTableBody');
        const resultsCount = document.getElementById('resultsCount');

        if (!tableBody || !resultsCount) return;

        resultsCount.textContent = this.filteredArchives.length;

        if (this.filteredArchives.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: #718096;">
                        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        No archives found matching your criteria
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = this.filteredArchives.map(archive => `
            <tr>
                <td>
                    <input type="checkbox" class="select-checkbox" data-id="${archive.id}" 
                           onchange="archiveManager.toggleItemSelection('${archive.id}', this.checked)">
                </td>
                <td>${this.formatDate(archive.date)}</td>
                <td>
                    <span class="audit-type-badge audit-type-${archive.type}">
                        ${this.getAuditTypeLabel(archive.type)}
                    </span>
                </td>
                <td><strong>${archive.reference}</strong></td>
                <td>${archive.auditeur}</td>
                <td>${archive.productionLine}</td>
                <td><strong>${archive.score}</strong></td>
                <td>
                    <button class="action-btn action-view" onclick="archiveManager.viewArchive('${archive.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn action-print" onclick="archiveManager.printArchive('${archive.id}')">
                        <i class="fas fa-print"></i> Print
                    </button>
                    <button class="action-btn action-export" onclick="archiveManager.exportArchive('${archive.id}')">
                        <i class="fas fa-download"></i> Export
                    </button>
                </td>
            </tr>
        `).join('');
    }

    updateStatistics() {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const recentArchives = this.archives.filter(archive => 
            new Date(archive.date) >= last30Days
        );

        const count5S = recentArchives.filter(a => a.type === '5s').length;
        const countAFP = recentArchives.filter(a => a.type === 'afp').length;
        const countTRAM = recentArchives.filter(a => a.type === 'tram').length;
        const countQK = recentArchives.filter(a => a.type === 'qk').length;

        const count5SEl = document.getElementById('count5S');
        const countAFPEl = document.getElementById('countAFP');
        const countTRAMEl = document.getElementById('countTRAM');
        const countQKEl = document.getElementById('countQK');

        if (count5SEl) count5SEl.textContent = count5S;
        if (countAFPEl) countAFPEl.textContent = countAFP;
        if (countTRAMEl) countTRAMEl.textContent = countTRAM;
        if (countQKEl) countQKEl.textContent = countQK;
    }

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.select-checkbox[data-id]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            const id = checkbox.getAttribute('data-id');
            if (checked) {
                this.selectedItems.add(id);
            } else {
                this.selectedItems.delete(id);
            }
        });
        this.updateBulkActions();
    }

    toggleItemSelection(id, checked) {
        if (checked) {
            this.selectedItems.add(id);
        } else {
            this.selectedItems.delete(id);
        }
        this.updateBulkActions();
    }

    updateBulkActions() {
        const bulkActions = document.getElementById('bulkActions');
        const selectedCount = document.getElementById('selectedCount');
        
        if (!bulkActions || !selectedCount) return;

        if (this.selectedItems.size > 0) {
            bulkActions.style.display = 'flex';
            selectedCount.textContent = this.selectedItems.size;
        } else {
            bulkActions.style.display = 'none';
        }
    }

    viewArchive(id) {
        const archive = this.archives.find(a => a.id === id);
        if (!archive) return;

        this.currentView = archive;
        const modal = document.getElementById('viewModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.innerHTML = `<i class="fas fa-eye"></i> ${this.getAuditTypeLabel(archive.type)} - ${archive.reference}`;
        modalBody.innerHTML = this.generateArchiveViewHTML(archive);

        modal.style.display = 'block';
    }

    generateArchiveViewHTML(archive) {
        let specificContent = '';

        switch (archive.type) {
            case '5s':
                specificContent = `
                    <div class="audit-detail-section">
                        <h4><i class="fas fa-broom"></i> 5S Assessment Details</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Workspace Areas:</label>
                                <span>${archive.data.workspaceAreas.join(', ')}</span>
                            </div>
                            <div class="detail-item">
                                <label>Total Criteria:</label>
                                <span>${archive.data.totalCriteria}</span>
                            </div>
                            <div class="detail-item">
                                <label>OK Count:</label>
                                <span class="status-ok">${archive.data.okCount}</span>
                            </div>
                            <div class="detail-item">
                                <label>NOT OK Count:</label>
                                <span class="status-not-ok">${archive.data.notOkCount}</span>
                            </div>
                            <div class="detail-item">
                                <label>N/A Count:</label>
                                <span class="status-na">${archive.data.naCount}</span>
                            </div>
                        </div>
                        <div class="improvement-section">
                            <label>Improvements:</label>
                            <p>${archive.data.improvements}</p>
                        </div>
                    </div>
                `;
                break;
            case 'afp':
                specificContent = `
                    <div class="audit-detail-section">
                        <h4><i class="fas fa-clipboard-check"></i> AFP Audit Details</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Total Checkpoints:</label>
                                <span>${archive.data.checkpoints}</span>
                            </div>
                            <div class="detail-item">
                                <label>Passed Checks:</label>
                                <span class="status-ok">${archive.data.passedChecks}</span>
                            </div>
                            <div class="detail-item">
                                <label>Failed Checks:</label>
                                <span class="status-not-ok">${archive.data.failedChecks}</span>
                            </div>
                            <div class="detail-item">
                                <label>Critical Issues:</label>
                                <span class="status-critical">${archive.data.criticalIssues}</span>
                            </div>
                        </div>
                        <div class="improvement-section">
                            <label>Recommendations:</label>
                            <p>${archive.data.recommendations}</p>
                        </div>
                    </div>
                `;
                break;
            case 'tram':
                specificContent = `
                    <div class="audit-detail-section">
                        <h4><i class="fas fa-chart-line"></i> TRAM Metrics Details</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Scrap Weight:</label>
                                <span>${archive.data.scrapWeight}g</span>
                            </div>
                            <div class="detail-item">
                                <label>Rework Count:</label>
                                <span>${archive.data.reworkCount}</span>
                            </div>
                            <div class="detail-item">
                                <label>Total Production:</label>
                                <span>${archive.data.totalProduction}</span>
                            </div>
                            <div class="detail-item">
                                <label>Defect Rate:</label>
                                <span>${archive.data.defectRate}%</span>
                            </div>
                            <div class="detail-item">
                                <label>PPM Calculation:</label>
                                <span class="ppm-value">${archive.data.ppmCalculation} PPM</span>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'qk':
                specificContent = `
                    <div class="audit-detail-section">
                        <h4><i class="fas fa-cogs"></i> QK Audit Details</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Piece Description:</label>
                                <span>${archive.data.pieceDescription}</span>
                            </div>
                            <div class="detail-item">
                                <label>Vehicle Type:</label>
                                <span>${archive.data.typeVehicule}</span>
                            </div>
                            <div class="detail-item">
                                <label>Number of Harnesses:</label>
                                <span>${archive.data.nombreFaisceaux}</span>
                            </div>
                            <div class="detail-item">
                                <label>Demerit Points:</label>
                                <span>${archive.data.pointsDemerites}</span>
                            </div>
                            <div class="detail-item">
                                <label>Number of Defects:</label>
                                <span>${archive.data.nombreDefauts}</span>
                            </div>
                        </div>
                        <div class="improvement-section">
                            <label>Improvement Actions:</label>
                            <p>${archive.data.actionsAmelioration}</p>
                        </div>
                    </div>
                `;
                break;
        }

        return `
            <div class="archive-view-container">
                <div class="archive-header">
                    <div class="archive-meta">
                        <div class="archive-info">
                            <div class="info-item">
                                <label>Date:</label>
                                <span>${this.formatDate(archive.date)}</span>
                            </div>
                            <div class="info-item">
                                <label>Reference:</label>
                                <span><strong>${archive.reference}</strong></span>
                            </div>
                            <div class="info-item">
                                <label>Auditeur:</label>
                                <span>${archive.auditeur}</span>
                            </div>
                            <div class="info-item">
                                <label>Production Line:</label>
                                <span>${archive.productionLine}</span>
                            </div>
                            <div class="info-item">
                                <label>Score/Status:</label>
                                <span class="score-badge"><strong>${archive.score}</strong></span>
                            </div>
                            <div class="info-item">
                                <label>Status:</label>
                                <span class="status-badge status-${archive.status}">${archive.status.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>
                ${specificContent}
            </div>
            <style>
                .archive-view-container { font-family: 'Segoe UI', sans-serif; }
                .archive-header { background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; }
                .archive-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
                .info-item { display: flex; flex-direction: column; gap: 0.25rem; }
                .info-item label { font-weight: 600; color: #4a5568; font-size: 0.9rem; }
                .info-item span { color: #2d3748; }
                .score-badge { color: #38a169; font-weight: bold; }
                .status-badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }
                .status-completed { background: #c6f6d5; color: #276749; }
                .status-validated { background: #bee3f8; color: #2a69ac; }
                .status-archived { background: #e2e8f0; color: #4a5568; }
                .audit-detail-section { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; }
                .audit-detail-section h4 { color: #2d3748; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
                .detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
                .detail-item { display: flex; flex-direction: column; gap: 0.25rem; }
                .detail-item label { font-weight: 600; color: #4a5568; font-size: 0.9rem; }
                .status-ok { color: #38a169; font-weight: bold; }
                .status-not-ok { color: #e53e3e; font-weight: bold; }
                .status-na { color: #a0aec0; font-weight: bold; }
                .status-critical { color: #e53e3e; font-weight: bold; background: #fed7d7; padding: 2px 6px; border-radius: 4px; }
                .ppm-value { color: #805ad5; font-weight: bold; }
                .improvement-section { background: #f0f8ff; padding: 1rem; border-radius: 6px; }
                .improvement-section label { font-weight: 600; color: #2d3748; display: block; margin-bottom: 0.5rem; }
                .improvement-section p { color: #4a5568; line-height: 1.6; }
            </style>
        `;
    }

    printArchive(id) {
        this.currentView = this.archives.find(a => a.id === id);
        this.showPrintModal();
    }

    showPrintModal() {
        const modal = document.getElementById('printModal');
        modal.style.display = 'block';
    }

    confirmPrint() {
        const printType = document.querySelector('input[name="printType"]:checked').value;
        this.closeModal('printModal');
        
        // Create print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(this.generatePrintHTML(this.currentView, printType));
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        
        this.showSuccessMessage('Print job sent successfully');
    }

    generatePrintHTML(archive, printType) {
        const currentDate = new Date().toLocaleDateString();
        
        let content = '';
        
        switch (printType) {
            case 'summary':
                content = `
                    <div class="print-summary">
                        <h2>${this.getAuditTypeLabel(archive.type)} - Summary Report</h2>
                        <div class="summary-info">
                            <p><strong>Reference:</strong> ${archive.reference}</p>
                            <p><strong>Date:</strong> ${this.formatDate(archive.date)}</p>
                            <p><strong>Auditeur:</strong> ${archive.auditeur}</p>
                            <p><strong>Production Line:</strong> ${archive.productionLine}</p>
                            <p><strong>Score:</strong> ${archive.score}</p>
                        </div>
                    </div>
                `;
                break;
            case 'detailed':
                content = this.generateArchiveViewHTML(archive);
                break;
            case 'client':
                content = `
                    <div class="client-header">
                        <img src="../../assets/logo.png" alt="LEONI" style="height: 50px;">
                        <h1>LEONI Quality Management System</h1>
                        <h2>Client Audit Report</h2>
                    </div>
                    ${this.generateArchiveViewHTML(archive)}
                `;
                break;
        }

        return `
<!DOCTYPE html>
<html>
<head>
    <title>Print - ${archive.reference}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .client-header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .print-summary { padding: 20px; }
        .summary-info p { margin: 10px 0; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    ${content}
    <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
        Generated on: ${currentDate} | LEONI Quality Management System
    </div>
</body>
</html>
        `;
    }

    exportArchive(id) {
        const archive = this.archives.find(a => a.id === id);
        if (!archive) return;

        const data = {
            ...archive,
            exportDate: new Date().toISOString(),
            exportedBy: 'AQL Agent'
        };

        this.downloadJSON(data, `${archive.reference}_export.json`);
        this.showSuccessMessage('Archive exported successfully');
    }

    exportAllResults() {
        const exportData = {
            totalRecords: this.filteredArchives.length,
            exportDate: new Date().toISOString(),
            exportedBy: 'AQL Agent',
            archives: this.filteredArchives
        };

        this.downloadJSON(exportData, `AQL_Archives_Export_${new Date().toISOString().split('T')[0]}.json`);
        this.showSuccessMessage(`${this.filteredArchives.length} archives exported successfully`);
    }

    bulkView() {
        if (this.selectedItems.size === 0) return;
        
        // For demo, just show the first selected item
        const firstId = Array.from(this.selectedItems)[0];
        this.viewArchive(firstId);
    }

    bulkPrint() {
        if (this.selectedItems.size === 0) return;
        
        this.showSuccessMessage(`Preparing to print ${this.selectedItems.size} archive(s)...`);
        // In real implementation, would generate combined print document
    }

    bulkExport() {
        if (this.selectedItems.size === 0) return;
        
        const selectedArchives = this.archives.filter(a => this.selectedItems.has(a.id));
        const exportData = {
            totalRecords: selectedArchives.length,
            exportDate: new Date().toISOString(),
            exportedBy: 'AQL Agent',
            archives: selectedArchives
        };

        this.downloadJSON(exportData, `AQL_Selected_Archives_${new Date().toISOString().split('T')[0]}.json`);
        this.showSuccessMessage(`${selectedArchives.length} selected archives exported successfully`);
    }

    // Quick search functions
    quickSearch(type) {
        const today = new Date();
        let dateFrom = '';
        
        switch (type) {
            case 'week':
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                dateFrom = weekAgo.toISOString().split('T')[0];
                break;
            case 'month':
                const monthAgo = new Date(today);
                monthAgo.setMonth(today.getMonth() - 1);
                dateFrom = monthAgo.toISOString().split('T')[0];
                break;
            case 'priority':
                // Filter for critical issues or low scores
                this.filteredArchives = this.archives.filter(archive => {
                    const score = parseFloat(archive.score);
                    return score < 90 || archive.data.criticalIssues > 0;
                });
                this.renderResults();
                this.showSuccessMessage('High priority archives filtered');
                return;
        }
        
        document.getElementById('dateFrom').value = dateFrom;
        document.getElementById('dateTo').value = today.toISOString().split('T')[0];
        this.performSearch();
    }

    createExportPackage() {
        const packageData = {
            packageInfo: {
                title: 'AQL Quality Archive Package',
                createdDate: new Date().toISOString(),
                createdBy: 'AQL Agent',
                description: 'Comprehensive quality audit package for client presentation'
            },
            summary: {
                totalArchives: this.archives.length,
                auditTypes: ['5S', 'AFP', 'TRAM', 'QK'],
                dateRange: {
                    from: Math.min(...this.archives.map(a => a.date)),
                    to: Math.max(...this.archives.map(a => a.date))
                }
            },
            archives: this.archives
        };

        this.downloadJSON(packageData, `AQL_Client_Audit_Package_${new Date().toISOString().split('T')[0]}.json`);
        this.showSuccessMessage('Client audit package created successfully');
    }

    // Utility functions
    getAuditTypeLabel(type) {
        const labels = {
            '5s': '5S Workplace Assessment',
            'afp': 'AFP - Audit Fabrication Process',
            'tram': 'TRAM - Quality Metrics',
            'qk': 'QK - Audit Produit'
        };
        return labels[type] || type.toUpperCase();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    showSuccessMessage(message) {
        const messageEl = document.getElementById('successMessage');
        const textEl = document.getElementById('successText');
        
        if (messageEl && textEl) {
            textEl.textContent = message;
            messageEl.style.display = 'block';
            messageEl.classList.add('show');
            
            setTimeout(() => {
                messageEl.classList.remove('show');
                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 300);
            }, 3000);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    exportCurrentView() {
        if (this.currentView) {
            this.exportArchive(this.currentView.id);
        }
    }
}

// Global functions
function closeModal(modalId) {
    archiveManager.closeModal(modalId);
}

function quickSearch(type) {
    archiveManager.quickSearch(type);
}

function createExportPackage() {
    archiveManager.createExportPackage();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.archiveManager = new AQLArchiveManager();
});

// Export for global access
window.AQLArchiveManager = AQLArchiveManager;
