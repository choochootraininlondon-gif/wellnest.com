// WellNest Application JavaScript — LocalStorage-based auth (no scroll lock)

class WellNestApp {
    constructor() {
        this.currentUser = null;
        this.usersKey = 'wellnest_users';
        this.sessionKey = 'wellnest_user';
        this.rememberKey = 'wellnest_remember';
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
        this.initCharts();
    }

    bindEvents() {
        document.getElementById('show-signup')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthForms();
        });

        document.getElementById('show-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthForms();
        });

        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('signup-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.handleLogout();
        });

        document.getElementById('dashboard-link')?.addEventListener('click', () => {
            this.navigateTo('dashboard');
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab')) {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId, e.target);
            }
        });

        document.getElementById('log-activity-btn')?.addEventListener('click', () => {
            this.logActivity();
        });
    }

    // ------------------- AUTH + STORAGE -------------------
    getUsers() {
        try {
            const raw = localStorage.getItem(this.usersKey);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            console.error('Failed to parse users from localStorage', e);
            return {};
        }
    }

    saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    toggleAuthForms() {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        loginForm.classList.toggle('hidden');
        signupForm.classList.toggle('hidden');
    }

    handleSignup() {
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('signup-email').value.trim().toLowerCase();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!fullname || !email || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        const users = this.getUsers();
        if (users[email]) {
            this.showNotification('An account with this email already exists', 'error');
            return;
        }

        const initials = fullname.split(' ').map(n => n[0]).join('').slice(0, 3).toUpperCase();
        users[email] = { name: fullname, password: password, initials };
        this.saveUsers(users);

        this.currentUser = { name: fullname, email, initials };
        localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));

        const remember = document.getElementById('remember-me')?.checked;
        if (remember) localStorage.setItem(this.rememberKey, 'true');
        else localStorage.removeItem(this.rememberKey);

        this.showApp();
        this.showNotification('Account created and signed in!', 'success');

        document.getElementById('fullname').value = '';
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-password').value = '';
        document.getElementById('confirm-password').value = '';
    }

    handleLogin() {
        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const users = this.getUsers();
        const user = users[email];
        if (!user || user.password !== password) {
            this.showNotification('Email or password is incorrect', 'error');
            return;
        }

        this.currentUser = { name: user.name, email, initials: user.initials };
        localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));

        const remember = document.getElementById('remember-me')?.checked;
        if (remember) localStorage.setItem(this.rememberKey, 'true');
        else localStorage.removeItem(this.rememberKey);

        this.showApp();
        this.showNotification('Signed in successfully!', 'success');

        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
        this.showLogin();
        this.showNotification('Logged out successfully', 'info');
    }

    checkAuthStatus() {
        const saved = localStorage.getItem(this.sessionKey);
        if (saved) {
            try {
                this.currentUser = JSON.parse(saved);
                this.showApp();
                return;
            } catch (e) {
                console.error('Invalid session in storage', e);
            }
        }
        this.showLogin();
    }

    showLogin() {
        document.getElementById('login-page').classList.add('active');
        document.getElementById('app').classList.remove('active');
    }

    showApp() {
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('app').classList.add('active');

        if (this.currentUser) {
            document.getElementById('user-avatar').textContent = this.currentUser.initials;
            document.getElementById('username').textContent = this.currentUser.name;
        }

        this.navigateTo('dashboard');
    }

    // ------------------- NAVIGATION, TABS, ACTIVITY -------------------
    navigateTo(page) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const linkEl = document.querySelector(`[data-page="${page}"]`);
        if (linkEl) linkEl.classList.add('active');

        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });

        const target = document.getElementById(page);
        if (target) target.classList.add('active');
    }

    switchTab(tabId, tabElement) {
        const tabs = tabElement.parentElement.querySelectorAll('.tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        tabElement.classList.add('active');

        const tabContents = tabElement.closest('.form-container').querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }

    logActivity() {
        const type = document.getElementById('activity-type').value;
        const duration = document.getElementById('activity-duration').value;
        if (!duration) {
            this.showNotification('Please enter activity duration', 'error');
            return;
        }
        this.showNotification(`Logged ${type} activity successfully!`, 'success');
        document.getElementById('activity-duration').value = '';
        document.getElementById('activity-distance').value = '';
        document.getElementById('activity-calories').value = '';
        document.getElementById('activity-notes').value = '';
    }

    // ------------------- CHARTS -------------------
    initCharts() {
        const safeGet = (id) => document.getElementById(id) && document.getElementById(id).getContext;
        try {
            if (safeGet('weeklyActivityChart')) {
                const weeklyCtx = document.getElementById('weeklyActivityChart').getContext('2d');
                new Chart(weeklyCtx, { type: 'bar', data: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ label: 'Steps', data: [8452,9234,7845,10234,9567,11234,8765], borderRadius: 8, borderSkipped: false }] }, options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}} } });
            }

            if (safeGet('nutritionChart')) {
                const nutritionCtx = document.getElementById('nutritionChart').getContext('2d');
                new Chart(nutritionCtx, { type:'doughnut', data:{ labels:['Protein','Carbs','Fat'], datasets:[{ data:[30,50,20], borderWidth:0, hoverOffset:4 }]}, options:{ responsive:true, maintainAspectRatio:false, cutout:'70%' } });
            }

            if (safeGet('stepsChart')) {
                const stepsCtx = document.getElementById('stepsChart').getContext('2d');
                new Chart(stepsCtx, { type:'line', data:{ labels:['Week 1','Week 2','Week 3','Week 4'], datasets:[{ label:'Average Steps', data:[7560,8230,8940,9250], tension:0.4, fill:true }]}, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}} } });
            }

            if (safeGet('weightChart')) {
                const weightCtx = document.getElementById('weightChart').getContext('2d');
                new Chart(weightCtx, { type:'line', data:{ labels:['Jan','Feb','Mar','Apr','May','Jun'], datasets:[{ label:'Weight (lbs)', data:[165,162,160,158,156,154], tension:0.4, fill:true }]}, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}} } });
            }

            if (safeGet('monthlyActivityChart')) {
                const monthlyCtx = document.getElementById('monthlyActivityChart').getContext('2d');
                new Chart(monthlyCtx, { type:'bar', data:{ labels:['Walking','Running','Cycling','Yoga','Strength'], datasets:[{ label:'Hours', data:[12,8,6,10,8], borderRadius:8 }]}, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}} } });
            }
        } catch (e) {
            console.warn('Chart initialization skipped (missing canvas?)', e);
        }
    }

    // ------------------- NOTIFICATIONS -------------------
    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'}; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; display: flex; align-items: center; gap: 15px; max-width: 400px; animation: slideIn 0.3s ease;`;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = 'background:none; border:none; color:white; font-size:20px; cursor:pointer; padding:0; width:24px; height:24px; display:flex; align-items:center; justify-content:center;';

        const style = document.createElement('style');
        style.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
        document.head.appendChild(style);

        closeBtn.addEventListener('click', () => notification.remove());
        setTimeout(() => { if (notification.parentElement) notification.remove(); }, 5000);
        document.body.appendChild(notification);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WellNestApp();
})
