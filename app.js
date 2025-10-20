// WellNest Application JavaScript

class WellNestApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
        this.initCharts();
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

    initCharts() {
        // Weekly Activity Chart
        const weeklyCtx = document.getElementById('weeklyActivityChart').getContext('2d');
        new Chart(weeklyCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Steps',
                    data: [8452, 9234, 7845, 10234, 9567, 11234, 8765],
                    backgroundColor: '#4CAF50',
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 14
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });

        // Nutrition Chart
        const nutritionCtx = document.getElementById('nutritionChart').getContext('2d');
        new Chart(nutritionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Protein', 'Carbs', 'Fat'],
                datasets: [{
                    data: [30, 50, 20],
                    backgroundColor: [
                        '#FF6B6B',
                        '#4ECDC4',
                        '#45B7D1'
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });

        // Steps Progress Chart
        const stepsCtx = document.getElementById('stepsChart').getContext('2d');
        new Chart(stepsCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Average Steps',
                    data: [7560, 8230, 8940, 9250],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#4CAF50',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        // Weight Chart
        const weightCtx = document.getElementById('weightChart').getContext('2d');
        new Chart(weightCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Weight (lbs)',
                    data: [165, 162, 160, 158, 156, 154],
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Monthly Activity Chart
        const monthlyCtx = document.getElementById('monthlyActivityChart').getContext('2d');
        new Chart(monthlyCtx, {
            type: 'bar',
            data: {
                labels: ['Walking', 'Running', 'Cycling', 'Yoga', 'Strength'],
                datasets: [{
                    label: 'Hours',
                    data: [12, 8, 6, 10, 8],
                    backgroundColor: [
                        '#4CAF50',
                        '#FF9800',
                        '#2196F3',
                        '#9C27B0',
                        '#F44336'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
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
