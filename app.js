// WellNest Application JavaScript

class WellNestApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
    }

    bindEvents() {
        // Login/Signup form toggling
        document.getElementById('show-signup')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthForms();
        });

        document.getElementById('show-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthForms();
        });

        // Login form submission
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Signup form submission
        document.getElementById('signup-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.handleLogout();
        });

        // Dashboard link
        document.getElementById('dashboard-link')?.addEventListener('click', () => {
            this.navigateTo('dashboard');
        });

        // Tab functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab')) {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId, e.target);
            }
        });

        // Activity logging
        document.getElementById('log-activity-btn')?.addEventListener('click', () => {
            this.logActivity();
        });
    }

    toggleAuthForms() {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        
        loginForm.classList.toggle('hidden');
        signupForm.classList.toggle('hidden');
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple validation
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate API call
        this.showNotification('Signing in...', 'info');
        
        setTimeout(() => {
            this.currentUser = {
                name: 'Jane Doe',
                email: email,
                initials: 'JD'
            };
            
            localStorage.setItem('wellnest_user', JSON.stringify(this.currentUser));
            this.showApp();
            this.showNotification('Welcome back!', 'success');
        }, 1000);
    }

    handleSignup() {
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Simple validation
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

        // Simulate API call
        this.showNotification('Creating your account...', 'info');
        
        setTimeout(() => {
            const initials = fullname.split(' ').map(n => n[0]).join('').toUpperCase();
            
            this.currentUser = {
                name: fullname,
                email: email,
                initials: initials
            };
            
            localStorage.setItem('wellnest_user', JSON.stringify(this.currentUser));
            this.showApp();
            this.showNotification('Account created successfully!', 'success');
        }, 1500);
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('wellnest_user');
        this.showLogin();
        this.showNotification('Logged out successfully', 'info');
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('wellnest_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showApp();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('login-page').classList.add('active');
        document.getElementById('app').classList.remove('active');
    }

    showApp() {
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('app').classList.add('active');
        
        // Update user info
        if (this.currentUser) {
            document.getElementById('user-avatar').textContent = this.currentUser.initials;
            document.getElementById('username').textContent = this.currentUser.name;
        }
    }

    navigateTo(page) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Hide all pages
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target page
        document.getElementById(page).classList.add('active');
    }

    switchTab(tabId, tabElement) {
        // Remove active class from all tabs in the same container
        const tabs = tabElement.parentElement.querySelectorAll('.tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to clicked tab
        tabElement.classList.add('active');
        
        // Hide all tab contents in the same container
        const tabContents = tabElement.closest('.form-container').querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Show target tab content
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }

    logActivity() {
        const type = document.getElementById('activity-type').value;
        const duration = document.getElementById('activity-duration').value;
        const distance = document.getElementById('activity-distance').value;
        const calories = document.getElementById('activity-calories').value;
        
        if (!duration) {
            this.showNotification('Please enter activity duration', 'error');
            return;
        }
        
        this.showNotification(`Logged ${type} activity successfully!`, 'success');
        
        // Clear form
        document.getElementById('activity-duration').value = '';
        document.getElementById('activity-distance').value = '';
        document.getElementById('activity-calories').value = '';
        document.getElementById('activity-notes').value = '';
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;

        // Add close button styles
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Add event listeners
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);

        document.body.appendChild(notification);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WellNestApp();

});
// WellNest Application JavaScript — LocalStorage-based auth


class WellNestApp {
constructor() {
this.currentUser = null; // { name, email, initials }
this.usersKey = 'wellnest_users'; // stores object: { email: { name, password, initials } }
this.sessionKey = 'wellnest_user'; // stores current logged-in user's email (or full object)
this.rememberKey = 'wellnest_remember'; // boolean true/false
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
const email = document.getElementById(
