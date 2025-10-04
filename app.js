// AfyaLink e-Referral Health System JavaScript
class AfyaLinkSystem {
    constructor() {
        this.currentUser = {
            id: 'DOC001',
            name: 'Dr. Sarah Johnson',
            role: 'doctor',
            department: 'Internal Medicine'
        };
        this.notifications = [];
        this.initializeEventListeners();
        this.loadDashboardData();
        this.initializeRealTimeUpdates();
    }

    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.showPage(page);
            });
        });

        // Notification button
        document.getElementById('notificationBtn').addEventListener('click', () => {
            this.showNotifications();
        });

        // Forms
        document.getElementById('patientForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPatient();
        });

        document.getElementById('referralForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createReferral();
        });

        // Search functionality
        document.getElementById('patientSearch').addEventListener('input', (e) => {
            this.searchPatients(e.target.value);
        });

        document.getElementById('facilitySearch').addEventListener('input', (e) => {
            this.searchFacilities(e.target.value);
        });

        // Filters
        document.getElementById('referralFilter').addEventListener('change', (e) => {
            this.filterReferrals(e.target.value);
        });

        document.getElementById('facilityType').addEventListener('change', (e) => {
            this.filterFacilities(e.target.value);
        });
    }

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });

        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = 'block';
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        // Load page-specific data
        this.loadPageData(pageId);
    }

    loadPageData(pageId) {
        switch(pageId) {
            case 'patients':
                this.loadPatientsData();
                break;
            case 'referrals':
                this.loadReferralsData();
                break;
            case 'facilities':
                this.loadFacilitiesData();
                break;
            case 'messages':
                this.loadMessagesData();
                break;
            case 'admin':
                this.loadAdminData();
                break;
        }
    }

    // Patient Management
    showPatientModal() {
        document.getElementById('patientModal').classList.add('active');
        this.generatePatientId();
    }

    generatePatientId() {
        const timestamp = Date.now().toString().slice(-6);
        document.getElementById('patientId').value = `PAT${timestamp}`;
    }

    addPatient() {
        const patientData = {
            id: document.getElementById('patientId').value,
            name: document.getElementById('patientName').value,
            age: document.getElementById('patientAge').value,
            gender: document.getElementById('patientGender').value,
            condition: document.getElementById('patientCondition').value,
            contact: document.getElementById('patientContact').value,
            emergencyContact: document.getElementById('emergencyContact').value,
            dateAdded: new Date().toISOString().split('T')[0]
        };

        // Add to patients table
        this.addPatientToTable(patientData);

        // Update statistics
        this.updatePatientStats();

        // Close modal and show success message
        this.closeModal('patientModal');
        this.showAlert('Patient added successfully!', 'success');

        // Add audit log
        this.addAuditLog('patient_created', `Added patient ${patientData.name} (${patientData.id})`);
    }

    addPatientToTable(patient) {
        const table = document.getElementById('patientsTable');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.condition}</td>
            <td>${patient.dateAdded}</td>
            <td><span class="status-badge status-accepted">Active</span></td>
            <td>
                <button class="btn btn-secondary" onclick="afyaLink.viewPatient('${patient.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-secondary" onclick="afyaLink.editPatient('${patient.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        table.appendChild(row);
    }

    updatePatientStats() {
        const totalPatients = document.querySelectorAll('#patientsTable tr').length;
        const activePatients = Math.floor(totalPatients * 0.8); // Mock data
        const newPatients = Math.floor(totalPatients * 0.2); // Mock data

        document.getElementById('totalPatients').textContent = totalPatients;
        document.getElementById('activePatients').textContent = activePatients;
        document.getElementById('newPatients').textContent = newPatients;
    }

    // Referral Management
    showReferralModal() {
        document.getElementById('referralModal').classList.add('active');
        this.generateReferralId();
    }

    generateReferralId() {
        const timestamp = Date.now().toString().slice(-6);
        document.getElementById('referralId').value = `REF${timestamp}`;
    }

    createReferral() {
        const referralData = {
            id: document.getElementById('referralId').value,
            patientId: document.getElementById('referralPatient').value,
            patientName: document.getElementById('referralPatient').options[
                document.getElementById('referralPatient').selectedIndex
            ].text.split(' (')[0],
            referringPhysician: document.getElementById('referringPhysician').value,
            referralTo: document.getElementById('referralTo').value,
            priority: document.getElementById('referralPriority').value,
            status: 'pending',
            dateCreated: new Date().toISOString().split('T')[0]
        };

        // Add to referrals table
        this.addReferralToTable(referralData);

        // Update statistics
        this.updateReferralStats();

        // Close modal and show success message
        this.closeModal('referralModal');
        this.showAlert('Referral created successfully!', 'success');

        // Add audit log
        this.addAuditLog('referral_created', `Created referral ${referralData.id} for ${referralData.patientName}`);
    }

    addReferralToTable(referral) {
        const table = document.getElementById('referralsTable');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${referral.id}</td>
            <td>${referral.patientName}</td>
            <td>${referral.referringPhysician}</td>
            <td>${this.getFacilityName(referral.referralTo)}</td>
            <td><span class="status-badge status-${referral.priority === 'high' || referral.priority === 'urgent' ? 'accepted' : 'completed'}">${referral.priority}</span></td>
            <td><span class="status-badge status-pending">${referral.status}</span></td>
            <td>${referral.dateCreated}</td>
            <td>
                <button class="btn btn-secondary" onclick="afyaLink.viewReferral('${referral.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-secondary" onclick="afyaLink.updateReferral('${referral.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        table.appendChild(row);
    }

    getFacilityName(facilityId) {
        const facilities = {
            'CGH001': 'City General Hospital',
            'MHC001': 'Metro Heart Center'
        };
        return facilities[facilityId] || facilityId;
    }

    updateReferralStats() {
        const totalReferrals = document.querySelectorAll('#referralsTable tr').length;
        const pendingReferrals = Math.floor(totalReferrals * 0.3); // Mock data
        const acceptedReferrals = Math.floor(totalReferrals * 0.5); // Mock data
        const completedReferrals = Math.floor(totalReferrals * 0.2); // Mock data

        document.getElementById('pendingReferrals').textContent = pendingReferrals;
        document.getElementById('acceptedReferrals').textContent = acceptedReferrals;
        document.getElementById('completedReferrals').textContent = completedReferrals;
    }

    // Facility Management
    searchFacilities(query) {
        const rows = document.querySelectorAll('#facilitiesTable tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
    }

    filterFacilities(type) {
        const rows = document.querySelectorAll('#facilitiesTable tr');
        rows.forEach(row => {
            if (type === '') {
                row.style.display = '';
            } else {
                const facilityType = row.cells[1].textContent.toLowerCase();
                row.style.display = facilityType.includes(type) ? '' : 'none';
            }
        });
    }

    referToFacility(facilityId) {
        this.showAlert(`Redirecting to referral form for ${this.getFacilityName(facilityId)}`, 'info');
        setTimeout(() => {
            this.showReferralModal();
            document.getElementById('referralTo').value = facilityId;
        }, 1000);
    }

    // Messaging System
    showMessageModal() {
        // This would open a new message composition modal
        this.showAlert('Message composition feature would open here', 'info');
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (message) {
            this.addMessageToChat('sent', message);
            messageInput.value = '';

            // Simulate response after delay
            setTimeout(() => {
                this.addMessageToChat('received', 'Thank you for your message. I\'ll review this shortly.');
            }, 2000);
        }
    }

    addMessageToChat(type, message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        messageDiv.innerHTML = `<strong>${type === 'sent' ? 'You' : 'Dr. Johnson'}:</strong> ${message}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Search and Filter Functions
    searchPatients(query) {
        const rows = document.querySelectorAll('#patientsTable tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
    }

    filterReferrals(status) {
        const rows = document.querySelectorAll('#referralsTable tr');
        rows.forEach(row => {
            if (status === 'all') {
                row.style.display = '';
            } else {
                const statusCell = row.cells[5].textContent.toLowerCase();
                row.style.display = statusCell.includes(status) ? '' : 'none';
            }
        });
    }

    // View/Edit Functions
    viewPatient(patientId) {
        this.showAlert(`Viewing patient details for ${patientId}`, 'info');
    }

    editPatient(patientId) {
        this.showAlert(`Edit patient form for ${patientId} would open here`, 'info');
    }

    viewReferral(referralId) {
        this.showAlert(`Viewing referral details for ${referralId}`, 'info');
    }

    updateReferral(referralId) {
        this.showAlert(`Update referral form for ${referralId} would open here`, 'info');
    }

    viewFacility(facilityId) {
        this.showAlert(`Viewing facility details for ${facilityId}`, 'info');
    }

    // Admin Functions
    showUserManagement() {
        console.log('showUserManagement function called');

        // Hide all pages first
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });

        // Show admin page first
        const adminPage = document.getElementById('admin');
        if (adminPage) {
            adminPage.style.display = 'block';
            console.log('Admin page shown');
        } else {
            console.log('Admin page not found');
        }

        // Show user management section within admin page
        const userManagementSection = document.getElementById('userManagementSection');
        if (userManagementSection) {
            userManagementSection.style.display = 'block';
            console.log('User management section shown');
        } else {
            console.log('User management section not found');
            this.showAlert('User management section not found!', 'error');
            return;
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const adminNavLink = document.querySelector('[data-page="admin"]');
        if (adminNavLink) {
            adminNavLink.classList.add('active');
            console.log('Admin navigation updated');
        }

        this.showAlert('User Management interface loaded successfully', 'success');
    }

    showAddUserModal() {
        const modal = document.getElementById('addUserModal');
        if (modal) {
            modal.classList.add('active');
        } else {
            this.showAlert('Add User modal not found', 'error');
        }
    }

    showBulkActions() {
        const selectedUsers = document.querySelectorAll('.user-checkbox:checked');
        if (selectedUsers.length === 0) {
            this.showAlert('Please select users to perform bulk actions', 'warning');
            return;
        }

        const actions = [
            'Activate Users',
            'Deactivate Users',
            'Reset Passwords',
            'Change Role',
            'Delete Users',
            'Export Data'
        ];

        const action = prompt('Select bulk action:\n' + actions.map((action, index) => `${index + 1}. ${action}`).join('\n'));
        if (action && action >= 1 && action <= actions.length) {
            const selectedAction = actions[action - 1];
            this.showAlert(`Bulk action "${selectedAction}" applied to ${selectedUsers.length} users`, 'success');
        }
    }

    viewUser(userId) {
        // Find user data
        const userRow = document.querySelector(`tr:has(input[value="${userId}"])`) || document.querySelector(`td:contains("${userId}")`)?.closest('tr');
        if (userRow) {
            const userData = {
                id: userRow.cells[1].textContent,
                name: userRow.cells[2].textContent,
                email: userRow.cells[3].textContent,
                role: userRow.cells[4].textContent,
                department: userRow.cells[5].textContent,
                status: userRow.cells[6].textContent,
                lastLogin: userRow.cells[7].textContent
            };

            const details = `
                User ID: ${userData.id}
                Name: ${userData.name}
                Email: ${userData.email}
                Role: ${userData.role}
                Department: ${userData.department}
                Status: ${userData.status}
                Last Login: ${userData.lastLogin}
            `;

            this.showAlert(`User Details:\n${details}`, 'info');
        } else {
            this.showAlert('User not found', 'error');
        }
    }

    editUser(userId) {
        // Find user data
        const userRow = document.querySelector(`tr:has(input[value="${userId}"])`) || document.querySelector(`td:contains("${userId}")`)?.closest('tr');
        if (userRow) {
            const userData = {
                id: userRow.cells[1].textContent,
                name: userRow.cells[2].textContent,
                email: userRow.cells[3].textContent,
                role: userRow.cells[4].textContent,
                department: userRow.cells[5].textContent,
                status: userRow.cells[6].textContent
            };

            this.showAlert(`Edit User: ${userData.name}\n\nCurrent Details:\n- Email: ${userData.email}\n- Role: ${userData.role}\n- Department: ${userData.department}\n- Status: ${userData.status}`, 'info');

            // Show edit modal (would be implemented with actual form)
            const newRole = prompt('Enter new role (admin, doctor, nurse, staff):', userData.role.replace(/<[^>]*>/, ''));
            if (newRole && ['admin', 'doctor', 'nurse', 'staff'].includes(newRole.toLowerCase())) {
                this.showAlert(`User role updated to: ${newRole}`, 'success');
            }
        } else {
            this.showAlert('User not found', 'error');
        }
    }

    resetUserPassword(userId) {
        if (confirm('Are you sure you want to reset the password for this user?')) {
            // Simulate password reset
            this.showAlert(`Password reset link sent to user ${userId}`, 'success');
        }
    }

    filterUsers() {
        const roleFilter = document.getElementById('userRoleFilter').value.toLowerCase();
        const statusFilter = document.getElementById('userStatusFilter').value.toLowerCase();
        const searchTerm = document.getElementById('userSearch').value.toLowerCase();

        const rows = document.querySelectorAll('#usersTable tr');
        let visibleCount = 0;

        rows.forEach(row => {
            const role = row.cells[4].textContent.toLowerCase();
            const status = row.cells[6].textContent.toLowerCase();
            const name = row.cells[2].textContent.toLowerCase();
            const email = row.cells[3].textContent.toLowerCase();

            const matchesRole = !roleFilter || role.includes(roleFilter);
            const matchesStatus = !statusFilter || status.includes(statusFilter);
            const matchesSearch = !searchTerm ||
                name.includes(searchTerm) ||
                email.includes(searchTerm);

            if (matchesRole && matchesStatus && matchesSearch) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // Update count
        document.getElementById('userCount').textContent = `Showing ${visibleCount} users`;
        this.showAlert(`Filtered to ${visibleCount} users`, 'info');
    }

    selectAllUsers() {
        const selectAllCheckbox = document.getElementById('selectAllUsers');
        const userCheckboxes = document.querySelectorAll('.user-checkbox');

        userCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });

        const selectedCount = selectAllCheckbox.checked ? userCheckboxes.length : 0;
        this.showAlert(`${selectedCount} users selected`, 'info');
    }

    previousUserPage() {
        this.showAlert('Previous page functionality would be implemented here', 'info');
    }

    nextUserPage() {
        this.showAlert('Next page functionality would be implemented here', 'info');
    }

    showSystemSettings() {
        this.showAlert('System settings interface would open here', 'info');
    }

    showAuditLogs() {
        this.showAlert('Audit logs interface would open here', 'info');
    }

    showReports() {
        this.showAlert('Reports generation interface would open here', 'info');
    }

    // Notifications
    showNotifications() {
        const notifications = [
            'New patient referral received',
            'Lab results ready for review',
            'Appointment scheduled for tomorrow',
            'System maintenance scheduled for tonight'
        ];

        const notificationList = notifications.map(notif =>
            `<div style="padding: 0.5rem; border-bottom: 1px solid #e2e8f0;">${notif}</div>`
        ).join('');

        this.showAlert(`<div>Recent Notifications:<br>${notificationList}</div>`, 'info');
    }

    // Utility Functions
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = message;
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    addAuditLog(action, description) {
        const auditEntry = {
            timestamp: new Date().toISOString(),
            user: this.currentUser.name,
            action,
            description
        };

        console.log('Audit Log:', auditEntry);
        // In a real system, this would be sent to the audit service
    }

    // Real-time Updates (Simulation)
    initializeRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.simulateRealTimeUpdates();
        }, 30000);
    }

    simulateRealTimeUpdates() {
        // Randomly update some statistics
        const updates = Math.floor(Math.random() * 3);

        if (updates > 0) {
            const currentPatients = parseInt(document.getElementById('totalPatients').textContent);
            document.getElementById('totalPatients').textContent = currentPatients + 1;

            const currentReferrals = parseInt(document.getElementById('pendingReferrals').textContent);
            document.getElementById('pendingReferrals').textContent = currentReferrals + 1;

            this.showAlert('New data received from real-time updates', 'info');
        }
    }

    // Data Loading Functions
    loadDashboardData() {
        // Load initial dashboard statistics
        this.updatePatientStats();
        this.updateReferralStats();
    }

    loadPatientsData() {
        // Load patients data (already handled by HTML)
    }

    loadReferralsData() {
        // Load referrals data (already handled by HTML)
    }

    loadFacilitiesData() {
        // Load facilities data (already handled by HTML)
    }

    loadMessagesData() {
        // Load messages data (already handled by HTML)
    }

    loadAdminData() {
        // Load admin data (already handled by HTML)
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.afyaLink = new AfyaLinkSystem();
});

// Additional utility functions for global access
function showPage(pageId) {
    window.afyaLink.showPage(pageId);
}

function closeModal(modalId) {
    window.afyaLink.closeModal(modalId);
}

function showPatientModal() {
    window.afyaLink.showPatientModal();
}

function showReferralModal() {
    window.afyaLink.showReferralModal();
}

function showMessageModal() {
    window.afyaLink.showMessageModal();
}

function sendMessage() {
    window.afyaLink.sendMessage();
}

// User Management Functions
function showUserManagement() {
    window.afyaLink.showUserManagement();
}

function showAddUserModal() {
    window.afyaLink.showAddUserModal();
}

function showBulkActions() {
    window.afyaLink.showBulkActions();
}

function viewUser(userId) {
    window.afyaLink.viewUser(userId);
}

function editUser(userId) {
    window.afyaLink.editUser(userId);
}

function resetUserPassword(userId) {
    window.afyaLink.resetUserPassword(userId);
}