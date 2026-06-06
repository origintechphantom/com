// Admin Credentials (hardcoded for initial setup purposes)
const ADMIN_CREDENTIALS = [
    {
        username: 'Harrison',
        password: 'Harrison2025'
    },
    {
        username: 'Doris',
        password: 'Doris2026'
    }
];

const ADMIN_ACCOUNTS_STORAGE_KEY = 'adminAccounts';

// Initialize Admin Dashboard
class AdminDashboard {
    constructor() {
        this.currentUser = null;
        this.currentMessageId = null;
        this.replyMode = 'send';
        this.init();
    }

    init() {
        this.loadAdminAccounts();
        this.checkLoginStatus();
        this.setupEventListeners();
        this.renderAdminList();
        window.addEventListener('storage', (event) => {
            if (event.key === 'adminChatThreads' || event.key === ADMIN_ACCOUNTS_STORAGE_KEY) {
                this.reloadDashboard();
            }
        });
    }

    reloadDashboard() {
        if (document.getElementById('dashboardContainer') && !document.getElementById('dashboardContainer').classList.contains('hidden')) {
            const activeSection = document.querySelector('.nav-item.active');
            if (activeSection) {
                const section = activeSection.dataset.section;
                if (section === 'messages') {
                    this.loadMessages();
                } else if (section === 'replies') {
                    this.loadReplies();
                } else if (section === 'settings') {
                    this.updateStats();
                }
            }
        }
    }

    checkLoginStatus() {
        const sessionData = sessionStorage.getItem('adminSession');
        if (sessionData) {
            this.currentUser = JSON.parse(sessionData);
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglePasswordVisibility(togglePassword, passwordInput);
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.switchSection(e.currentTarget));
        });

        // Modal close buttons
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeMessageModal());
        }

        // Reply button
        const sendReplyBtn = document.getElementById('sendReplyBtn');
        if (sendReplyBtn) {
            sendReplyBtn.addEventListener('click', () => this.handleReplyAction());
        }

        // Edit reply button
        const editReplyBtn = document.getElementById('editReplyBtn');
        if (editReplyBtn) {
            editReplyBtn.addEventListener('click', () => this.editReply());
        }

        // Change password
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => this.openChangePasswordModal());
        }

        // Change password form
        const changePasswordForm = document.getElementById('changePasswordForm');
        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', (e) => this.handleChangePassword(e));
        }

        // Add admin form
        const addAdminForm = document.getElementById('addAdminForm');
        if (addAdminForm) {
            addAdminForm.addEventListener('submit', (e) => this.addNewAdmin(e));
        }

        // Toggle password visibility in admin form
        const toggleAdminPassword = document.getElementById('toggleAdminPassword');
        const newAdminPassword = document.getElementById('newAdminPassword');
        if (toggleAdminPassword && newAdminPassword) {
            toggleAdminPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglePasswordVisibility(toggleAdminPassword, newAdminPassword);
            });
        }

        const adminList = document.getElementById('adminList');
        if (adminList) {
            adminList.addEventListener('click', (e) => {
                const deleteButton = e.target.closest('.admin-delete-btn');
                if (deleteButton) {
                    const username = deleteButton.dataset.username;
                    if (username) {
                        this.deleteAdmin(username);
                    }
                }
            });
        }

        // Close password modal
        const closePasswordModal = document.getElementById('closePasswordModal');
        if (closePasswordModal) {
            closePasswordModal.addEventListener('click', () => this.closeChangePasswordModal());
        }

        // Clear all button
        const clearAllBtn = document.getElementById('clearAllBtn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllData());
        }

        // Reset admins button
        const resetAdminsBtn = document.getElementById('resetAdminsBtn');
        if (resetAdminsBtn) {
            resetAdminsBtn.addEventListener('click', () => this.openResetAdminsModal());
        }

        const closeResetAdminsModal = document.getElementById('closeResetAdminsModal');
        if (closeResetAdminsModal) {
            closeResetAdminsModal.addEventListener('click', () => this.closeResetAdminsModal());
        }

        const cancelResetAdminsBtn = document.getElementById('cancelResetAdminsBtn');
        if (cancelResetAdminsBtn) {
            cancelResetAdminsBtn.addEventListener('click', () => this.closeResetAdminsModal());
        }

        const confirmResetAdminsBtn = document.getElementById('confirmResetAdminsBtn');
        if (confirmResetAdminsBtn) {
            confirmResetAdminsBtn.addEventListener('click', () => this.resetAdminAccounts());
        }

        // Close modal on background click
        const messageModal = document.getElementById('messageModal');
        if (messageModal) {
            messageModal.addEventListener('click', (e) => {
                if (e.target === messageModal) {
                    this.closeMessageModal();
                }
            });
        }

        const changePasswordModal = document.getElementById('changePasswordModal');
        if (changePasswordModal) {
            changePasswordModal.addEventListener('click', (e) => {
                if (e.target === changePasswordModal) {
                    this.closeChangePasswordModal();
                }
            });
        }

        const resetAdminsModal = document.getElementById('resetAdminsModal');
        if (resetAdminsModal) {
            resetAdminsModal.addEventListener('click', (e) => {
                if (e.target === resetAdminsModal) {
                    this.closeResetAdminsModal();
                }
            });
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('loginError');

        const matchedUser = this.getAdminCredentials().find(
            (admin) => admin.username === username && admin.password === password
        );

        if (matchedUser) {
            // Login successful
            const sessionData = {
                username: matchedUser.username,
                password: matchedUser.password,
                loginTime: new Date().toISOString()
            };
            sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
            this.currentUser = sessionData;
            errorElement.classList.remove('show');
            this.showDashboard();
            document.getElementById('loginForm').reset();
        } else {
            // Login failed
            errorElement.textContent = 'Invalid username or password';
            errorElement.classList.add('show');
        }
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem('adminSession');
            this.currentUser = null;
            this.showLogin();
            document.getElementById('loginForm').reset();
            document.getElementById('loginError').classList.remove('show');
        }
    }

    showLogin() {
        document.getElementById('loginContainer').classList.remove('hidden');
        document.getElementById('dashboardContainer').classList.add('hidden');
    }

    showDashboard() {
        document.getElementById('loginContainer').classList.add('hidden');
        document.getElementById('dashboardContainer').classList.remove('hidden');
        document.getElementById('adminUsername').textContent = this.currentUser.username;
        const currentUsernameDisplay = document.getElementById('currentUsernameDisplay');
        if (currentUsernameDisplay) {
            currentUsernameDisplay.textContent = this.currentUser.username;
        }
        this.loadMessages();
        this.updateStats();
    }

    switchSection(navItem) {
        const section = navItem.dataset.section;
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        navItem.classList.add('active');

        // Update active section
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.remove('active');
        });

        const sectionElement = document.getElementById(section + 'Section');
        if (sectionElement) {
            sectionElement.classList.add('active');
        }

        // Update title
        const titles = {
            messages: 'Messages',
            replies: 'Replies',
            settings: 'Settings'
        };
        document.getElementById('sectionTitle').textContent = titles[section] || 'Dashboard';

        // Load section content
        if (section === 'messages') {
            this.loadMessages();
        } else if (section === 'replies') {
            this.loadReplies();
        } else if (section === 'settings') {
            setTimeout(() => {
                this.renderAdminList();
                this.updateStats();
            }, 50);
        }
    }

    loadMessages() {
        const messagesList = document.getElementById('messagesList');
        const threads = this.getAllThreads();

        if (threads.length === 0) {
            messagesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No chat threads yet</p>
                </div>
            `;
            document.getElementById('messageBadge').textContent = '0';
            return;
        }

        const unreadCount = threads.filter(t => t.status === 'unread').length;
        document.getElementById('messageBadge').textContent = unreadCount;

        messagesList.innerHTML = '';
        threads.slice().reverse().forEach(thread => {
            const lastMessage = thread.messages[thread.messages.length - 1];
            const hasAdminReply = thread.messages.some(msg => msg.sender === 'admin');
            const isUnread = thread.status === 'unread';
            const unreadCustomerMessages = thread.messages.filter(msg => msg.sender === 'customer' && msg.status === 'sent').length;
            const preview = lastMessage ? lastMessage.text.substring(0, 100) : 'No messages yet';

            const messageElement = document.createElement('div');
            messageElement.className = `message-item ${isUnread ? 'unread' : ''} ${hasAdminReply ? 'replied' : ''}`;
            const statusBadge = unreadCustomerMessages > 0 ? `<span class="unseen-badge">${unreadCustomerMessages}</span>` : '';
            messageElement.innerHTML = `
                <div class="message-header">
                    <div>
                        <div class="message-from">${this.escapeHtml(thread.name)}${statusBadge}</div>
                    </div>
                </div>
                <div class="message-preview">${this.escapeHtml(preview)}...</div>
                <span class="message-status ${hasAdminReply ? 'status-replied' : 'status-unread'}">
                    ${hasAdminReply ? '✓ Replied' : isUnread ? '● Unread' : 'Open'}
                </span>
            `;
            messageElement.addEventListener('click', () => this.openMessage(thread.id));
            messagesList.appendChild(messageElement);
        });
    }

    getAllThreads() {
        const threads = localStorage.getItem('adminChatThreads');
        const legacy = localStorage.getItem('contactMessages');
        if (threads) {
            return JSON.parse(threads);
        }

        if (legacy) {
            const legacyMessages = JSON.parse(legacy);
            const converted = legacyMessages.map(msg => ({
                id: msg.id,
                name: msg.name,
                email: msg.email,
                createdAt: msg.date,
                status: msg.read ? 'read' : 'unread',
                messages: [
                    {
                        sender: 'customer',
                        text: msg.message,
                        date: msg.date
                    }
                ].concat(msg.reply ? [{ sender: 'admin', text: msg.reply.text, date: msg.reply.date }] : [])
            }));
            localStorage.setItem('adminChatThreads', JSON.stringify(converted));
            localStorage.removeItem('contactMessages');
            return converted;
        }

        return [];
    }

    openMessage(threadId) {
        const threads = this.getAllThreads();
        const thread = threads.find(t => t.id === threadId);

        if (!thread) return;

        // Mark customer messages as seen when the admin opens the thread
        let updated = false;
        thread.messages.forEach(msg => {
            if (msg.sender === 'customer' && msg.status === 'sent') {
                msg.status = 'seen';
                updated = true;
            }
        });

        thread.status = 'read';
        if (updated) {
            localStorage.setItem('adminChatThreads', JSON.stringify(threads));
        } else {
            localStorage.setItem('adminChatThreads', JSON.stringify(threads));
        }

        this.currentMessageId = threadId;

        document.getElementById('detailName').textContent = thread.name;

        const chatHistory = document.getElementById('chatHistory');
        chatHistory.innerHTML = '';

        thread.messages.forEach(msg => {
            const statusText = msg.status ? (msg.status === 'seen' ? 'Seen' : 'Sent') : '';
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${msg.sender === 'admin' ? 'admin' : 'customer'}`;
            bubble.innerHTML = `
                <p>${this.escapeHtml(msg.text)}</p>
                <small>${this.formatDate(msg.date)}${statusText ? ` • ${statusText}` : ''}</small>
            `;
            chatHistory.appendChild(bubble);
        });

        chatHistory.scrollTop = chatHistory.scrollHeight;

        const replySection = document.getElementById('replySection');
        replySection.classList.remove('hidden');
        document.getElementById('replyText').value = '';

        document.getElementById('messageModal').classList.remove('hidden');
        this.replyMode = 'send';
        const sendBtn = document.getElementById('sendReplyBtn');
        if (sendBtn) {
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
        }
        this.loadMessages();
    }

    closeMessageModal() {
        document.getElementById('messageModal').classList.add('hidden');
        this.currentMessageId = null;
    }

    handleReplyAction() {
        if (this.replyMode === 'update') {
            this.updateReply();
        } else {
            this.sendReply();
        }
    }

    sendReply() {
        const replyText = document.getElementById('replyText').value.trim();

        if (!replyText) {
            alert('Please enter a reply message');
            return;
        }

        const threads = this.getAllThreads();
        const thread = threads.find(t => t.id === this.currentMessageId);

        if (!thread) return;

        thread.messages.push({
            sender: 'admin',
            text: replyText,
            date: new Date().toISOString(),
            status: 'sent'
        });
        thread.status = 'read';

        localStorage.setItem('adminChatThreads', JSON.stringify(threads));

        this.openMessage(this.currentMessageId);
        this.loadMessages();
        this.loadReplies();
        this.updateStats();
    }

    editReply() {
        const threads = this.getAllThreads();
        const thread = threads.find(t => t.id === this.currentMessageId);

        if (!thread) return;

        const lastAdminMessage = [...thread.messages].reverse().find(msg => msg.sender === 'admin');
        if (!lastAdminMessage) return;

        document.getElementById('replyText').value = lastAdminMessage.text;
        document.getElementById('replySection').classList.remove('hidden');
        document.getElementById('existingReply').classList.add('hidden');

        this.replyMode = 'update';
        const sendBtn = document.getElementById('sendReplyBtn');
        if (sendBtn) {
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Update Reply';
        }
    }

    updateReply() {
        const replyText = document.getElementById('replyText').value.trim();

        if (!replyText) {
            alert('Please enter a reply message');
            return;
        }

        const threads = this.getAllThreads();
        const thread = threads.find(t => t.id === this.currentMessageId);

        if (!thread) return;

        const lastAdminMessageIndex = thread.messages.map(msg => msg.sender).lastIndexOf('admin');
        if (lastAdminMessageIndex === -1) return;

        thread.messages[lastAdminMessageIndex].text = replyText;
        thread.messages[lastAdminMessageIndex].date = new Date().toISOString();

        localStorage.setItem('adminChatThreads', JSON.stringify(threads));

        this.openMessage(this.currentMessageId);
        this.loadMessages();
        this.loadReplies();
    }

    loadReplies() {
        const repliesList = document.getElementById('repliesList');
        const threads = this.getAllThreads();
        const repliedMessages = threads.flatMap(thread =>
            thread.messages
                .filter(msg => msg.sender === 'admin')
                .map(msg => ({ thread, msg }))
        );

        if (repliedMessages.length === 0) {
            repliesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <p>No replies sent yet</p>
                </div>
            `;
            return;
        }

        repliesList.innerHTML = '';
        repliedMessages.reverse().forEach(({ thread, msg }) => {
            const replyElement = document.createElement('div');
            replyElement.className = 'reply-item';
            replyElement.innerHTML = `
                <div class="reply-item-header">
                    <div>
                        <div class="reply-item-to">Reply to ${this.escapeHtml(thread.name)}</div>
                    </div>
                </div>
                <div class="reply-item-text">${this.escapeHtml(msg.text)}</div>
            `;
            repliesList.appendChild(replyElement);
        });
    }

    openChangePasswordModal() {
        document.getElementById('changePasswordModal').classList.remove('hidden');
        document.getElementById('passwordError').classList.remove('show');
        document.getElementById('passwordError').textContent = '';
        document.getElementById('changePasswordForm').reset();
    }

    closeChangePasswordModal() {
        document.getElementById('changePasswordModal').classList.add('hidden');
    }

    handleChangePassword(e) {
        e.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorElement = document.getElementById('passwordError');

        // Validate current password
        if (!this.currentUser || currentPassword !== this.currentUser.password) {
            errorElement.textContent = 'Current password is incorrect';
            errorElement.classList.add('show');
            return;
        }

        // Validate new password
        if (newPassword.length < 6) {
            errorElement.textContent = 'New password must be at least 6 characters long';
            errorElement.classList.add('show');
            return;
        }

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            errorElement.textContent = 'Passwords do not match';
            errorElement.classList.add('show');
            return;
        }

        // Password change successful (in real app, this would be sent to server)
        alert('Password changed successfully! (Note: This is a demo - password changes are not persisted)');
        this.closeChangePasswordModal();
        document.getElementById('changePasswordForm').reset();
    }

    updateStats() {
        const threads = this.getAllThreads();
        const totalReplies = threads.reduce((count, thread) => count + thread.messages.filter(msg => msg.sender === 'admin').length, 0);

        document.getElementById('totalMessages').textContent = threads.length;
        document.getElementById('totalReplies').textContent = totalReplies;
        this.renderAdminList();
    }

    clearAllData() {
        if (confirm('Are you sure you want to delete all messages and replies? This action cannot be undone.')) {
            localStorage.removeItem('contactMessages');
            localStorage.removeItem('adminChatThreads');
            this.loadMessages();
            this.loadReplies();
            this.updateStats();
            alert('All data has been cleared');
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
        }
    }

    getAdminCredentials() {
        const storedAccounts = localStorage.getItem(ADMIN_ACCOUNTS_STORAGE_KEY);
        if (storedAccounts) {
            try {
                const accounts = JSON.parse(storedAccounts);
                if (Array.isArray(accounts) && accounts.length > 0) {
                    return accounts;
                }
            } catch (error) {
                console.warn('Failed to parse stored admin accounts', error);
            }
        }
        localStorage.setItem(ADMIN_ACCOUNTS_STORAGE_KEY, JSON.stringify(ADMIN_CREDENTIALS));
        return ADMIN_CREDENTIALS;
    }

    saveAdminCredentials(accounts) {
        localStorage.setItem(ADMIN_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
        this.adminAccounts = accounts;
    }

    loadAdminAccounts() {
        this.adminAccounts = this.getAdminCredentials();
    }

    renderAdminList() {
        const adminList = document.getElementById('adminList');
        if (!adminList) return;

        this.loadAdminAccounts();
        if (this.adminAccounts.length === 0) {
            adminList.innerHTML = '<li class="admin-account-item">No admins configured.</li>';
            return;
        }

        adminList.innerHTML = this.adminAccounts.map(admin => {
            const isCurrent = this.currentUser && this.currentUser.username === admin.username;
            const disabled = isCurrent ? 'disabled' : '';
            const label = isCurrent ? ' (current)' : '';
            return `
                <li class="admin-account-item">
                    <span>${this.escapeHtml(admin.username)}${label}</span>
                    <button type="button" class="admin-delete-btn" data-username="${this.escapeHtml(admin.username)}" ${disabled}>
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </li>
            `;
        }).join('');
    }

    addNewAdmin(e) {
        e.preventDefault();
        const usernameInput = document.getElementById('newAdminUsername');
        const passwordInput = document.getElementById('newAdminPassword');
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert('Please provide both a username and password for the new admin.');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        this.loadAdminAccounts();
        const existing = this.adminAccounts.find(admin => admin.username.toLowerCase() === username.toLowerCase());
        if (existing) {
            alert('That username is already an admin. Please choose a different username.');
            return;
        }

        this.adminAccounts.push({ username, password });
        this.saveAdminCredentials(this.adminAccounts);
        this.renderAdminList();
        usernameInput.value = '';
        passwordInput.value = '';
        alert(`Admin account ${username} has been added successfully.`);
    }

    deleteAdmin(username) {
        this.loadAdminAccounts();
        if (this.currentUser && this.currentUser.username === username) {
            alert('You cannot delete the admin account currently logged in.');
            return;
        }

        if (!confirm(`Delete admin user ${username}? This action cannot be undone.`)) {
            return;
        }

        const remaining = this.adminAccounts.filter(admin => admin.username !== username);
        if (remaining.length === 0) {
            alert('At least one admin account must remain.');
            return;
        }

        this.saveAdminCredentials(remaining);
        this.renderAdminList();
        alert(`Admin account ${username} has been deleted.`);
    }

    openResetAdminsModal() {
        const resetModal = document.getElementById('resetAdminsModal');
        if (resetModal) {
            resetModal.classList.remove('hidden');
        }
    }

    closeResetAdminsModal() {
        const resetModal = document.getElementById('resetAdminsModal');
        if (resetModal) {
            resetModal.classList.add('hidden');
        }
    }

    resetAdminAccounts() {
        this.closeResetAdminsModal();
        this.saveAdminCredentials(ADMIN_CREDENTIALS.slice());
        this.loadAdminAccounts();
        this.renderAdminList();

        const currentUsername = this.currentUser?.username;
        const defaultUser = ADMIN_CREDENTIALS.find(admin => admin.username === currentUsername);

        if (!defaultUser) {
            alert('Admin accounts have been reset. Your current session no longer matches the default admins, so you will be logged out.');
            sessionStorage.removeItem('adminSession');
            this.currentUser = null;
            this.showLogin();
            return;
        }

        alert('Admin accounts have been reset to default values.');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    togglePasswordVisibility(toggleButton, passwordInput) {
        const isPassword = passwordInput.type === 'password';
        
        if (isPassword) {
            passwordInput.type = 'text';
            toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            passwordInput.type = 'password';
            toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdminDashboard();
});
