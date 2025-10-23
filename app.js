// WellNest Application JavaScript

class WellNestApp {
    constructor() {
        this.currentUser = null;
        this.userData = {
            activities: [],
            meals: [],
            waterLogs: [],
            exercises: [],
            metrics: {
                steps: 8542,
                water: 1.8,
                sleep: 7.42,
                calories: 1850
            }
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
        this.initCharts();
        this.loadUserData();
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

        // Meal logging
        document.getElementById('log-meal-btn')?.addEventListener('click', () => {
            this.logMeal();
        });

        // Water logging
        document.getElementById('log-water-btn')?.addEventListener('click', () => {
            this.logWater();
        });

        // Exercise logging
        document.getElementById('log-exercise-btn')?.addEventListener('click', () => {
            this.logExercise();
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
        
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        this.showNotification('Signing in...', 'info');
        
        setTimeout(() => {
            this.currentUser = {
                name: 'Jane Doe',
                email: email,
                initials: 'JD'
            };
            
            localStorage.setItem('wellnest_user', JSON.stringify(this.currentUser));
            this.loadUserData();
            this.showApp();
            this.showNotification('Welcome back!', 'success');
        }, 1000);
    }

    handleSignup() {
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('signup-email').value;
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

        this.showNotification('Creating your account...', 'info');
        
        setTimeout(() => {
            const initials = fullname.split(' ').map(n => n[0]).join('').toUpperCase();
            
            this.currentUser = {
                name: fullname,
                email: email,
                initials: initials
            };
            
            localStorage.setItem('wellnest_user', JSON.stringify(this.currentUser));
            this.loadUserData();
            this.showApp();
            this.showNotification('Account created successfully!', 'success');
        }, 1500);
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('wellnest_user');
        localStorage.removeItem('wellnest_data');
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

    loadUserData() {
        const savedData = localStorage.getItem('wellnest_data');
        if (savedData) {
            this.userData = JSON.parse(savedData);
        }
        this.updateDashboard();
        this.updateActivityHistory();
        this.updateExerciseHistory();
        this.updateProgressCharts();
    }

    saveUserData() {
        localStorage.setItem('wellnest_data', JSON.stringify(this.userData));
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
    }

    navigateTo(page) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });

        document.getElementById(page).classList.add('active');

        // Update specific page content when navigating
        if (page === 'activity') {
            this.updateActivityHistory();
        } else if (page === 'exercise') {
            this.updateExerciseHistory();
        } else if (page === 'progress') {
            this.updateProgressCharts();
        }
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
        const duration = parseInt(document.getElementById('activity-duration').value);
        const distance = parseFloat(document.getElementById('activity-distance').value) || 0;
        const calories = parseInt(document.getElementById('activity-calories').value);
        const notes = document.getElementById('activity-notes').value;
        
        if (!duration || !calories) {
            this.showNotification('Please fill in required fields', 'error');
            return;
        }

        const activity = {
            id: Date.now(),
            type: type,
            duration: duration,
            distance: distance,
            calories: calories,
            notes: notes,
            date: new Date().toISOString(),
            timestamp: new Date().toLocaleString()
        };

        this.userData.activities.unshift(activity);
        
        // Update metrics
        this.userData.metrics.steps += Math.floor(duration * 100);
        this.userData.metrics.calories -= calories;
        
        this.saveUserData();
        this.updateDashboard();
        this.updateActivityHistory();
        this.showNotification(`Logged ${type} activity successfully!`, 'success');
        
        // Clear form
        document.getElementById('activity-duration').value = '';
        document.getElementById('activity-distance').value = '';
        document.getElementById('activity-calories').value = '';
        document.getElementById('activity-notes').value = '';
    }

    logMeal() {
        const mealType = document.getElementById('meal-type').value;
        const foodName = document.getElementById('food-name').value;
        const calories = parseInt(document.getElementById('calories').value);
        const protein = parseInt(document.getElementById('protein').value) || 0;
        const carbs = parseInt(document.getElementById('carbs').value) || 0;
        const fat = parseInt(document.getElementById('fat').value) || 0;
        const notes = document.getElementById('notes').value;
        
        if (!foodName || !calories) {
            this.showNotification('Please fill in required fields', 'error');
            return;
        }

        const meal = {
            id: Date.now(),
            type: mealType,
            food: foodName,
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat,
            notes: notes,
            timestamp: new Date().toLocaleString()
        };

        this.userData.meals.unshift(meal);
        
        // Update metrics
        this.userData.metrics.calories += calories;
        
        this.saveUserData();
        this.updateDashboard();
        this.showNotification(`Logged ${mealType} successfully!`, 'success');
        
        // Clear form
        document.getElementById('food-name').value = '';
        document.getElementById('calories').value = '';
        document.getElementById('protein').value = '';
        document.getElementById('carbs').value = '';
        document.getElementById('fat').value = '';
        document.getElementById('notes').value = '';
    }

    logWater() {
        const amount = parseFloat(document.getElementById('water-amount').value);
        const time = document.getElementById('water-time').value;
        
        if (!amount || !time) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const waterLog = {
            id: Date.now(),
            amount: amount,
            time: time,
            timestamp: new Date().toLocaleString()
        };

        this.userData.waterLogs.unshift(waterLog);
        
        // Update metrics (convert ml to liters)
        this.userData.metrics.water += (amount / 1000);
        
        this.saveUserData();
        this.updateDashboard();
        this.showNotification(`Logged ${amount}ml of water!`, 'success');
        
        // Clear form
        document.getElementById('water-amount').value = '';
        document.getElementById('water-time').value = '';
    }

    logExercise() {
        const type = document.getElementById('exercise-type').value;
        const name = document.getElementById('exercise-name').value;
        const duration = parseInt(document.getElementById('exercise-duration').value);
        const intensity = document.getElementById('exercise-intensity').value;
        const notes = document.getElementById('exercise-notes').value;
        
        if (!name || !duration) {
            this.showNotification('Please fill in required fields', 'error');
            return;
        }

        const exercise = {
            id: Date.now(),
            type: type,
            name: name,
            duration: duration,
            intensity: intensity,
            notes: notes,
            timestamp: new Date().toLocaleString()
        };

        this.userData.exercises.unshift(exercise);
        this.saveUserData();
        this.updateExerciseHistory();
        this.showNotification(`Logged ${name} exercise!`, 'success');
        
        // Clear form
        document.getElementById('exercise-name').value = '';
        document.getElementById('exercise-duration').value = '';
        document.getElementById('exercise-notes').value = '';
    }

    updateDashboard() {
        // Update metric values
        document.getElementById('steps-value').textContent = this.userData.metrics.steps.toLocaleString();
        document.getElementById('water-value').textContent = this.userData.metrics.water.toFixed(1) + 'L';
        document.getElementById('sleep-value').textContent = this.formatSleepTime(this.userData.metrics.sleep);
        document.getElementById('calories-value').textContent = this.userData.metrics.calories.toLocaleString();

        // Update progress bars
        document.getElementById('steps-progress').style.width = `${Math.min((this.userData.metrics.steps / 10000) * 100, 100)}%`;
        document.getElementById('water-progress').style.width = `${Math.min((this.userData.metrics.water / 3) * 100, 100)}%`;
        document.getElementById('sleep-progress').style.width = `${Math.min((this.userData.metrics.sleep / 8) * 100, 100)}%`;
        document.getElementById('calories-progress').style.width = `${Math.min((this.userData.metrics.calories / 2200) * 100, 100)}%`;

        // Update recent activities
        this.updateRecentActivities();
        
        // Update meals
        this.updateMealsList();
    }

    updateRecentActivities() {
        const container = document.getElementById('dashboard-activities');
        const recentActivities = this.userData.activities.slice(0, 3);
        
        if (recentActivities.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-walking"></i>
                    <p>No activities logged yet. Start tracking your fitness journey!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentActivities.map(activity => `
            <div class="activity-card ${activity.type}">
                <div class="activity-header">
                    <div class="activity-icon">
                        <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                    </div>
                    <div>
                        <h3>${this.formatActivityType(activity.type)}</h3>
                        <p>${activity.timestamp}</p>
                    </div>
                </div>
                <p>${activity.duration} minutes${activity.distance ? ` • ${activity.distance} mi` : ''}</p>
                ${activity.notes ? `<p class="activity-notes">${activity.notes}</p>` : ''}
                <div class="activity-details">
                    <div class="activity-stat">
                        <div class="stat-value">${activity.duration}m</div>
                        <div class="stat-label">Duration</div>
                    </div>
                    ${activity.distance ? `
                    <div class="activity-stat">
                        <div class="stat-value">${activity.distance}</div>
                        <div class="stat-label">Distance</div>
                    </div>
                    ` : ''}
                    <div class="activity-stat">
                        <div class="stat-value">${activity.calories}</div>
                        <div class="stat-label">Calories</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateActivityHistory() {
        const container = document.getElementById('activity-history');
        const activities = this.userData.activities;
        
        if (activities.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-walking"></i>
                    <p>No activities logged yet. Start by logging your first activity!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = activities.map(activity => `
            <div class="activity-card ${activity.type}">
                <div class="activity-header">
                    <div class="activity-icon">
                        <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                    </div>
                    <div>
                        <h3>${this.formatActivityType(activity.type)}</h3>
                        <p>${activity.timestamp}</p>
                    </div>
                </div>
                <p>${activity.duration} minutes${activity.distance ? ` • ${activity.distance} mi` : ''}</p>
                ${activity.notes ? `<p class="activity-notes">${activity.notes}</p>` : ''}
                <div class="activity-details">
                    <div class="activity-stat">
                        <div class="stat-value">${activity.duration}m</div>
                        <div class="stat-label">Duration</div>
                    </div>
                    ${activity.distance ? `
                    <div class="activity-stat">
                        <div class="stat-value">${activity.distance}</div>
                        <div class="stat-label">Distance</div>
                    </div>
                    ` : ''}
                    <div class="activity-stat">
                        <div class="stat-value">${activity.calories}</div>
                        <div class="stat-label">Calories</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateExerciseHistory() {
        const container = document.getElementById('exercise-history');
        const exercises = this.userData.exercises;
        
        if (exercises.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-dumbbell"></i>
                    <p>No exercises logged yet. Start by logging your first workout!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = exercises.map(exercise => `
            <div class="exercise-card ${exercise.type.toLowerCase()}">
                <div class="exercise-header">
                    <div class="exercise-icon">
                        <i class="fas fa-${this.getExerciseIcon(exercise.type)}"></i>
                    </div>
                    <div>
                        <h3>${exercise.name}</h3>
                        <p>${exercise.timestamp}</p>
                    </div>
                </div>
                <p>${exercise.duration} minutes • ${exercise.intensity} intensity</p>
                ${exercise.notes ? `<p class="exercise-notes">${exercise.notes}</p>` : ''}
                <div class="exercise-details">
                    <div class="activity-stat">
                        <div class="stat-value">${exercise.duration}m</div>
                        <div class="stat-label">Duration</div>
                    </div>
                    <div class="activity-stat">
                        <div class="stat-value">${exercise.intensity}</div>
                        <div class="stat-label">Intensity</div>
                    </div>
                    <div class="activity-stat">
                        <div class="stat-value">${Math.floor(exercise.duration * 5)}</div>
                        <div class="stat-label">Calories</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateMealsList() {
        const container = document.getElementById('meals-list');
        const recentMeals = this.userData.meals.slice(0, 4);
        
        if (recentMeals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-utensils"></i>
                    <p>No meals logged today. Start tracking your nutrition!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentMeals.map(meal => `
            <div class="meal-item">
                <div><strong>${meal.type}</strong>: ${meal.food}</div>
                <div class="meal-calories">${meal.calories} cal</div>
            </div>
        `).join('');
    }

    updateProgressCharts() {
        // This would update the progress charts with new data
        // For now, we'll just reinitialize them
        this.initCharts();
    }

    // Helper methods
    formatSleepTime(hours) {
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        return `${wholeHours}h ${minutes}m`;
    }

    getActivityIcon(type) {
        const icons = {
            walking: 'walking',
            running: 'running',
            cycling: 'bicycle',
            swimming: 'swimmer',
            yoga: 'spa',
            strength: 'dumbbell'
        };
        return icons[type] || 'walking';
    }

    getExerciseIcon(type) {
        const icons = {
            'Strength Training': 'dumbbell',
            'Cardio': 'heartbeat',
            'Flexibility': 'spa',
            'Sports': 'baseball-ball'
        };
        return icons[type] || 'dumbbell';
    }

    formatActivityType(type) {
        return type.charAt(0).toUpperCase() + type.slice(1);
    }

    initCharts() {
        // Weekly Activity Chart
        const weeklyCtx = document.getElementById('weeklyActivityChart');
        if (weeklyCtx) {
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
        }

        // Nutrition Chart
        const nutritionCtx = document.getElementById('nutritionChart');
        if (nutritionCtx) {
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
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Steps Progress Chart
        const stepsCtx = document.getElementById('stepsChart');
        if (stepsCtx) {
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
        }

        // Weight Chart
        const weightCtx = document.getElementById('weightChart');
        if (weightCtx) {
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
        }

        // Monthly Activity Chart
        const monthlyCtx = document.getElementById('monthlyActivityChart');
        if (monthlyCtx) {
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
    }

    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

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

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

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