class StaffManager {
    constructor() {
        this.staff = [...mockData.staff];
        this.filteredStaff = [...this.staff];
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateSelectBoxes();
        this.renderTable();
        this.setupModal();
    }

    setupEventListeners() {
        // Search and filter buttons
        document.getElementById('searchBtn').addEventListener('click', () => this.filterStaff());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearFilters());
        
        // CRUD operation buttons
        document.getElementById('addStaffBtn').addEventListener('click', () => this.openModal('add'));
        document.getElementById('deleteSelectedBtn').addEventListener('click', () => this.deleteSelected());
        
        // Modal buttons
        document.getElementById('saveStaffBtn').addEventListener('click', () => this.saveStaff());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        
        // Close modal when clicking outside
        document.getElementById('staffModal').addEventListener('click', (e) => {
            if (e.target.id === 'staffModal') {
                this.closeModal();
            }
        });
    }

    populateSelectBoxes() {
        // Populate role select
        const roleSelect = document.getElementById('roleFilter');
        mockData.roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            roleSelect.appendChild(option);
        });

        // Populate project select
        const projectSelect = document.getElementById('projectFilter');
        mockData.projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project;
            option.textContent = project;
            projectSelect.appendChild(option);
        });

        // Populate production line select
        const lineSelect = document.getElementById('lineFilter');
        mockData.productionLines.forEach(line => {
            const option = document.createElement('option');
            option.value = line;
            option.textContent = line;
            lineSelect.appendChild(option);
        });

        // Populate modal selects
        this.populateModalSelects();
    }

    populateModalSelects() {
        // Modal role select
        const modalRoleSelect = document.getElementById('staffRole');
        mockData.roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            modalRoleSelect.appendChild(option);
        });

        // Modal project select
        const modalProjectSelect = document.getElementById('staffProject');
        mockData.projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project;
            option.textContent = project;
            modalProjectSelect.appendChild(option);
        });

        // Modal production lines (checkboxes)
        const linesContainer = document.getElementById('staffLines');
        mockData.productionLines.forEach(line => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'checkbox-item';
            checkboxDiv.innerHTML = `
                <input type="checkbox" id="line_${line.replace(/\s+/g, '_')}" value="${line}">
                <label for="line_${line.replace(/\s+/g, '_')}">${line}</label>
            `;
            linesContainer.appendChild(checkboxDiv);
        });
    }

    filterStaff() {
        const roleFilter = document.getElementById('roleFilter').value;
        const projectFilter = document.getElementById('projectFilter').value;
        const lineFilter = document.getElementById('lineFilter').value;

        this.filteredStaff = this.staff.filter(person => {
            const roleMatch = !roleFilter || person.role === roleFilter;
            const projectMatch = !projectFilter || person.project === projectFilter;
            const lineMatch = !lineFilter || person.productionLines.includes(lineFilter);
            
            return roleMatch && projectMatch && lineMatch;
        });

        this.renderTable();
        this.updateResultsCount();
    }

    clearFilters() {
        document.getElementById('roleFilter').value = '';
        document.getElementById('projectFilter').value = '';
        document.getElementById('lineFilter').value = '';
        
        this.filteredStaff = [...this.staff];
        this.renderTable();
        this.updateResultsCount();
    }

    renderTable() {
        const tbody = document.getElementById('staffTableBody');
        tbody.innerHTML = '';

        this.filteredStaff.forEach(person => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="staff-checkbox" data-id="${person.id}">
                </td>
                <td>${person.fullName}</td>
                <td>
                    <span class="role-badge role-${person.role.toLowerCase().replace(/[^a-z]/g, '')}">${person.role}</span>
                </td>
                <td>${person.project}</td>
                <td>${person.productionLines.join(', ')}</td>
                <td>
                    <span class="status-badge status-${person.status.toLowerCase().replace(/\s+/g, '')}">${person.status}</span>
                </td>
                <td class="actions">
                    <button onclick="staffManager.editStaff(${person.id})" class="btn-edit" title="Edit">✏️</button>
                    <button onclick="staffManager.deleteStaff(${person.id})" class="btn-delete" title="Delete">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.updateResultsCount();
    }

    updateResultsCount() {
        const count = this.filteredStaff.length;
        const total = this.staff.length;
        document.getElementById('resultsCount').textContent = `Showing ${count} of ${total} staff members`;
    }

    openModal(mode, staffId = null) {
        this.currentEditingId = staffId;
        const modal = document.getElementById('staffModal');
        const title = document.getElementById('modalTitle');
        
        if (mode === 'add') {
            title.textContent = 'Add New Staff Member';
            this.clearModalForm();
        } else if (mode === 'edit' && staffId) {
            title.textContent = 'Edit Staff Member';
            this.populateModalForm(staffId);
        }
        
        modal.style.display = 'flex';
    }

    closeModal() {
        document.getElementById('staffModal').style.display = 'none';
        this.currentEditingId = null;
        this.clearModalForm();
    }

    clearModalForm() {
        document.getElementById('staffName').value = '';
        document.getElementById('staffEmail').value = '';
        document.getElementById('staffPhone').value = '';
        document.getElementById('staffRole').value = '';
        document.getElementById('staffProject').value = '';
        document.getElementById('staffHireDate').value = '';
        
        // Clear production line checkboxes
        const checkboxes = document.querySelectorAll('#staffLines input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
    }

    populateModalForm(staffId) {
        const staff = this.staff.find(s => s.id === staffId);
        if (!staff) return;

        document.getElementById('staffName').value = staff.fullName;
        document.getElementById('staffEmail').value = staff.email;
        document.getElementById('staffPhone').value = staff.phone;
        document.getElementById('staffRole').value = staff.role;
        document.getElementById('staffProject').value = staff.project;
        document.getElementById('staffHireDate').value = staff.hireDate;

        // Set production line checkboxes
        const checkboxes = document.querySelectorAll('#staffLines input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = staff.productionLines.includes(cb.value);
        });
    }

    saveStaff() {
        const formData = this.getModalFormData();
        if (!this.validateFormData(formData)) {
            return;
        }

        if (this.currentEditingId) {
            // Update existing staff
            const index = this.staff.findIndex(s => s.id === this.currentEditingId);
            if (index !== -1) {
                this.staff[index] = { ...this.staff[index], ...formData };
            }
        } else {
            // Add new staff
            const newId = Math.max(...this.staff.map(s => s.id)) + 1;
            const newStaff = {
                id: newId,
                ...formData,
                status: 'Active'
            };
            this.staff.push(newStaff);
        }

        this.filteredStaff = [...this.staff];
        this.renderTable();
        this.closeModal();
        this.showNotification(this.currentEditingId ? 'Staff updated successfully!' : 'Staff added successfully!');
    }

    getModalFormData() {
        const selectedLines = Array.from(document.querySelectorAll('#staffLines input[type="checkbox"]:checked'))
            .map(cb => cb.value);

        return {
            fullName: document.getElementById('staffName').value.trim(),
            email: document.getElementById('staffEmail').value.trim(),
            phone: document.getElementById('staffPhone').value.trim(),
            role: document.getElementById('staffRole').value,
            project: document.getElementById('staffProject').value,
            productionLines: selectedLines,
            hireDate: document.getElementById('staffHireDate').value
        };
    }

    validateFormData(data) {
        if (!data.fullName || !data.email || !data.role || !data.project || !data.hireDate) {
            this.showNotification('Please fill in all required fields!', 'error');
            return false;
        }

        if (data.productionLines.length === 0) {
            this.showNotification('Please select at least one production line!', 'error');
            return false;
        }

        // Check for duplicate email (excluding current editing staff)
        const existingStaff = this.staff.find(s => 
            s.email.toLowerCase() === data.email.toLowerCase() && 
            s.id !== this.currentEditingId
        );
        
        if (existingStaff) {
            this.showNotification('Email already exists!', 'error');
            return false;
        }

        return true;
    }

    editStaff(id) {
        this.openModal('edit', id);
    }

    deleteStaff(id) {
        if (confirm('Are you sure you want to delete this staff member?')) {
            this.staff = this.staff.filter(s => s.id !== id);
            this.filteredStaff = this.filteredStaff.filter(s => s.id !== id);
            this.renderTable();
            this.showNotification('Staff deleted successfully!');
        }
    }

    deleteSelected() {
        const selectedIds = Array.from(document.querySelectorAll('.staff-checkbox:checked'))
            .map(cb => parseInt(cb.dataset.id));

        if (selectedIds.length === 0) {
            this.showNotification('Please select staff members to delete!', 'error');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedIds.length} staff member(s)?`)) {
            this.staff = this.staff.filter(s => !selectedIds.includes(s.id));
            this.filteredStaff = this.filteredStaff.filter(s => !selectedIds.includes(s.id));
            this.renderTable();
            this.showNotification(`${selectedIds.length} staff member(s) deleted successfully!`);
        }
    }

    setupModal() {
        // Setup modal drag functionality (optional enhancement)
        const modal = document.querySelector('.modal-content');
        const header = document.querySelector('.modal-header');
        
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', (e) => {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target === header) {
                isDragging = true;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                xOffset = currentX;
                yOffset = currentY;
                
                modal.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        });

        document.addEventListener('mouseup', () => {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        });
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Initialize the staff manager when page loads
let staffManager;
document.addEventListener('DOMContentLoaded', () => {
    staffManager = new StaffManager();
});