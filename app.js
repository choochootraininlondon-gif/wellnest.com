// WellNest Application JavaScript

class WellNestApp {
    constructor() {
        this.currentUser = null;
        this.userData = {
            activities: [],
            meals: [],
            waterLogs: [],
            exercises: [],
            goals: [
                {
                    id: 1,
                    type: 'steps',
                    target: 10000,
                    period: 'daily',
                    description: 'Daily step goal',
                    progress: 8542,
                    createdAt: new Date().toISOString(),
                    completed: false
                },
                {
                    id: 2,
                    type: 'water',
                    target: 3,
                    period: 'daily',
                    description: 'Daily water intake',
                    progress: 1.8,
                    createdAt: new Date().toISOString(),
                    completed: false
                },
                {
                    id: 3,
                    type: 'sleep',
                    target: 8,
                    period: 'daily',
                    description: 'Daily sleep goal',
                    progress: 7.42,
                    createdAt: new Date().toISOString(),
                    completed: false
                },
                {
                    id: 4,
                    type: 'calories',
                    target: 2200,
                    period: 'daily',
                    description: 'Daily calorie intake',
                    progress: 1850,
                    createdAt: new Date().toISOString(),
                    completed: false
                }
            ],
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
        console.log('Initializing WellNest App...');
        this.bindEvents();
        this.checkAuthStatus();
        this.initCharts();
        this.loadUserData();
        this.checkWeeklyGoals();
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Login/Signup form toggling - FIXED: Better event delegation
        document.addEventListener('click', (e) => {
            if (e.target.id === 'show-signup') {
                e.preventDefault();
                this.toggleAuthForms();
            }
            if (e.target.id === 'show-login') {
                e.preventDefault();
                this.toggleAuthForms();
            }
        });

        // Login form submission - FIXED: Direct button click handling
        const loginForm = document.getElementById('login-form');
        const loginButton = loginForm?.querySelector('button[type="submit"]');
        if (loginButton) {
            loginButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Login button clicked');
                this.handleLogin();
            });
        }

        // Signup form submission - FIXED: Direct button click handling
        const signupForm = document.getElementById('signup-form');
        const signupButton = signupForm?.querySelector('button[type="submit"]');
        if (signupButton) {
            signupButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Signup button clicked');
                this.handleSignup();
            });
        }

        // Also bind to form submit events as backup
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Login form submitted');
                this.handleLogin();
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Signup form submitted');
                this.handleSignup();
            });
        }

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Dashboard link
        const dashboardLink = document.getElementById('dashboard-link');
        if (dashboardLink) {
            dashboardLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('dashboard');
            });
        }

        // Tab functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab')) {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId, e.target);
            }
        });

        // Activity logging
        const logActivityBtn = document.getElementById('log-activity-btn');
        if (logActivityBtn) {
            logActivityBtn.addEventListener('click', () => {
                this.logActivity();
            });
        }

        // Meal logging
        const logMealBtn = document.getElementById('log-meal-btn');
        if (logMealBtn) {
            logMealBtn.addEventListener('click', () => {
                this.logMeal();
            });
        }

        // Water logging
        const logWaterBtn = document.getElementById('log-water-btn');
        if (logWaterBtn) {
            logWaterBtn.addEventListener('click', () => {
                this.logWater();
            });
        }

        // Exercise logging
        const logExerciseBtn = document.getElementById('log-exercise-btn');
        if (logExerciseBtn) {
            logExerciseBtn.addEventListener('click', () => {
                this.logExercise();
            });
        }

        // Goal creation
        const createGoalBtn = document.getElementById('create-goal-btn');
        if (createGoalBtn) {
            createGoalBtn.addEventListener('click', () => {
                this.createGoal();
            });
        }

        console.log('All events bound successfully');
    }

    toggleAuthForms() {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        
        if (loginForm && signupForm) {
            const isLoginHidden = loginForm.classList.contains('hidden');
            loginForm.classList.toggle('hidden');
            signupForm.classList.toggle('hidden');
            console.log('Toggled forms. Login hidden:', !isLoginHidden);
        }
    }

    handleLogin() {
        console.log('=== LOGIN PROCESS STARTED ===');
        
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const rememberMeInput = document.getElementById('remember-me');
        
        if (!emailInput || !passwordInput) {
            console.error('Login form elements not found');
            this.showNotification('Login form error', 'error');
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;
        const rememberMe = rememberMeInput ? rememberMeInput.checked : false;
        
        console.log('Login attempt with:', { email, password, rememberMe });
        
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        this.showNotification('Signing in...', 'info');
        
        // Simulate API call with timeout
        setTimeout(() => {
            console.log('Processing login...');
            
            // For demo purposes, create user data
            this.currentUser = {
                name: email.split('@')[0], // Use email prefix as name for demo
                email: email,
                initials: email.substring(0, 2).toUpperCase()
            };
            
            // Save to localStorage
            localStorage.setItem('wellnest_user', JSON.stringify(this.currentUser));
            
            if (rememberMe) {
                localStorage.setItem('wellnest_login_email', email);
            } else {
                localStorage.removeItem('wellnest_login_email');
            }
            
            console.log('Login successful, user:', this.currentUser);
            this.loadUserData();
            this.showApp();
            this.showNotification('Welcome back!', 'success');
        }, 1000);
    }

    handleSignup() {
        console.log('=== SIGNUP PROCESS STARTED ===');
        
        const fullnameInput = document.getElementById('fullname');
        const emailInput = document.getElementById('signup-email');
        const passwordInput = document.getElementById('signup-password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        
        if (!fullnameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
            console.error('Signup form elements not found');
            this.showNotification('Signup form error', 'error');
            return;
        }

        const fullname = fullnameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        console.log('Signup attempt with:', { fullname, email, password, confirmPassword });
        
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
        
        // Simulate API call with timeout
        setTimeout(() => {
            console.log('Processing signup...');
            const initials = fullname.split(' ').map(n => n[0]).join('').toUpperCase();
            
            this.currentUser = {
                name: fullname,
                email: email,
                initials: initials
            };
            
            // Save to localStorage
            localStorage.setItem('wellnest_user', JSON.stringify(this.currentUser));
            localStorage.setItem('wellnest_login_email', email);
            
            console.log('Signup successful, user:', this.currentUser);
            this.loadUserData();
            this.showApp();
            this.showNotification('Account created successfully!', 'success');
        }, 1500);
    }

    handleLogout() {
        console.log('Logging out...');
        this.currentUser = null;
        localStorage.removeItem('wellnest_user');
        localStorage.removeItem('wellnest_data');
        this.showLogin();
        this.showNotification('Logged out successfully', 'info');
    }

    checkAuthStatus() {
        console.log('Checking auth status...');
        const savedUser = localStorage.getItem('wellnest_user');
        const savedEmail = localStorage.getItem('wellnest_login_email');
        
        console.log('Saved user:', savedUser);
        console.log('Saved email:', savedEmail);
        
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                console.log('User found:', this.currentUser);
                
                // Pre-fill email if remembered
                if (savedEmail && document.getElementById('email')) {
                    document.getElementById('email').value = savedEmail;
                    if (document.getElementById('remember-me')) {
                        document.getElementById('remember-me').checked = true;
                    }
                }
                
                this.showApp();
            } catch (error) {
                console.error('Error parsing saved user:', error);
                this.showLogin();
            }
        } else {
            console.log('No saved user, showing login');
            this.showLogin();
        }
    }

    loadUserData() {
        console.log('Loading user data...');
        const savedData = localStorage.getItem('wellnest_data');
        if (savedData) {
            try {
                this.userData = JSON.parse(savedData);
                console.log('User data loaded:', this.userData);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        } else {
            console.log('No saved user data, using defaults');
        }
        this.updateDashboard();
        this.updateActivityHistory();
        this.updateExerciseHistory();
        this.updateGoalsList();
        this.updateProgressCharts();
    }

    saveUserData() {
        console.log('Saving user data...');
        localStorage.setItem('wellnest_data', JSON.stringify(this.userData));
    }

    showLogin() {
        console.log('Showing login page');
        const loginPage = document.getElementById('login-page');
        const app = document.getElementById('app');
        
        if (loginPage) {
            loginPage.classList.add('active');
            console.log('Login page activated');
        }
        if (app) {
            app.classList.remove('active');
            console.log('App page deactivated');
        }
    }

    showApp() {
        console.log('Showing app page');
        const loginPage = document.getElementById('login-page');
        const app = document.getElementById('app');
        
        if (loginPage) {
            loginPage.classList.remove('active');
            console.log('Login page deactivated');
        }
        if (app) {
            app.classList.add('active');
            console.log('App page activated');
        }
        
        if (this.currentUser) {
            const userAvatar = document.getElementById('user-avatar');
            const username = document.getElementById('username');
            
            if (userAvatar) {
                userAvatar.textContent = this.currentUser.initials;
                console.log('User avatar updated:', this.currentUser.initials);
            }
            if (username) {
                username.textContent = this.currentUser.name;
                console.log('Username updated:', this.currentUser.name);
            }
        }
        
        // Navigate to dashboard by default
        this.navigateTo('dashboard');
    }

    navigateTo(page) {
        console.log('Navigating to:', page);
        
        // Update navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });

        // Update page sections
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
            if (section.id === page) {
                section.classList.add('active');
                console.log('Section activated:', page);
            }
        });

        // Update specific page content when navigating
        if (page === 'activity') {
            this.updateActivityHistory();
        } else if (page === 'exercise') {
            this.updateExerciseHistory();
        } else if (page === 'progress') {
            this.updateProgressCharts();
        } else if (page === 'goals') {
            this.updateGoalsList();
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
        this.checkGoalProgress();
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
        this.checkGoalProgress();
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
        this.checkGoalProgress();
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
        this.checkGoalProgress();
        this.showNotification(`Logged ${name} exercise!`, 'success');
        
        // Clear form
        document.getElementById('exercise-name').value = '';
        document.getElementById('exercise-duration').value = '';
        document.getElementById('exercise-notes').value = '';
    }

    createGoal() {
        const type = document.getElementById('goal-type').value;
        const target = parseInt(document.getElementById('goal-target').value);
        const period = document.getElementById('goal-period').value;
        const description = document.getElementById('goal-description').value;
        
        if (!target) {
            this.showNotification('Please fill in required fields', 'error');
            return;
        }

        const goal = {
            id: Date.now(),
            type: type,
            target: target,
            period: period,
            description: description,
            progress: 0,
            createdAt: new Date().toISOString(),
            completed: false
        };

        this.userData.goals.unshift(goal);
        this.saveUserData();
        this.updateGoalsList();
        this.updateDashboard();
        this.showNotification(`Created ${period} ${type} goal!`, 'success');
        
        // Clear form
        document.getElementById('goal-target').value = '';
        document.getElementById('goal-description').value = '';
    }

    updateDashboard() {
        console.log('Updating dashboard...');
        
        // Update metric values
        const stepsValue = document.getElementById('steps-value');
        const waterValue = document.getElementById('water-value');
        const sleepValue = document.getElementById('sleep-value');
        const caloriesValue = document.getElementById('calories-value');

        if (stepsValue) stepsValue.textContent = this.userData.metrics.steps.toLocaleString();
        if (waterValue) waterValue.textContent = this.userData.metrics.water.toFixed(1) + 'L';
        if (sleepValue) sleepValue.textContent = this.formatSleepTime(this.userData.metrics.sleep);
        if (caloriesValue) caloriesValue.textContent = this.userData.metrics.calories.toLocaleString();

        // Get current goals for dashboard display
        const stepsGoal = this.userData.goals.find(goal => goal.type === 'steps' && goal.period === 'daily');
        const waterGoal = this.userData.goals.find(goal => goal.type === 'water' && goal.period === 'daily');
        const sleepGoal = this.userData.goals.find(goal => goal.type === 'sleep' && goal.period === 'daily');
        const caloriesGoal = this.userData.goals.find(goal => goal.type === 'calories' && goal.period === 'daily');

        // Update goal displays
        const stepsGoalEl = document.querySelector('.steps .metric-goal');
        const waterGoalEl = document.querySelector('.water .metric-goal');
        const sleepGoalEl = document.querySelector('.sleep .metric-goal');
        const caloriesGoalEl = document.querySelector('.calories .metric-goal');

        if (stepsGoalEl) stepsGoalEl.textContent = `Goal: ${(stepsGoal?.target || 10000).toLocaleString()} steps`;
        if (waterGoalEl) waterGoalEl.textContent = `Goal: ${waterGoal?.target || 3}L`;
        if (sleepGoalEl) sleepGoalEl.textContent = `Goal: ${sleepGoal?.target || 8}h`;
        if (caloriesGoalEl) caloriesGoalEl.textContent = `Goal: ${(caloriesGoal?.target || 2200).toLocaleString()}`;

        // Update progress bars with current goals
        const stepsProgress = document.getElementById('steps-progress');
        const waterProgress = document.getElementById('water-progress');
        const sleepProgress = document.getElementById('sleep-progress');
        const caloriesProgress = document.getElementById('calories-progress');

        if (stepsProgress) stepsProgress.style.width = `${Math.min((this.userData.metrics.steps / (stepsGoal?.target || 10000)) * 100, 100)}%`;
        if (waterProgress) waterProgress.style.width = `${Math.min((this.userData.metrics.water / (waterGoal?.target || 3)) * 100, 100)}%`;
        if (sleepProgress) sleepProgress.style.width = `${Math.min((this.userData.metrics.sleep / (sleepGoal?.target || 8)) * 100, 100)}%`;
        if (caloriesProgress) caloriesProgress.style.width = `${Math.min((this.userData.metrics.calories / (caloriesGoal?.target || 2200)) * 100, 100)}%`;

        // Update recent activities
        this.updateRecentActivities();
        
        // Update meals
        this.updateMealsList();
        
        console.log('Dashboard updated successfully');
    }

    updateRecentActivities() {
        const container = document.getElementById('dashboard-activities');
        if (!container) return;

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
        if (!container) return;

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
        if (!container) return;

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
        if (!container) return;

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

    updateGoalsList() {
        const container = document.getElementById('goals-list');
        if (!container) return;

        const goals = this.userData.goals;
        
        if (goals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bullseye"></i>
                    <p>No goals set yet. Create your first wellness goal!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = goals.map(goal => {
            const progressPercent = Math.min((goal.progress / goal.target) * 100, 100);
            return `
            <div class="goal-card">
                <div class="goal-header">
                    <div class="goal-title">${this.formatGoalType(goal.type)}</div>
                    <div class="goal-period">${goal.period}</div>
                </div>
                <p class="goal-description">${goal.description || 'No description provided'}</p>
                <div class="goal-progress">
                    <div class="goal-stats">
                        <span>Progress: ${goal.progress} / ${goal.target}</span>
                        <span>${Math.round(progressPercent)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
                <div class="goal-actions">
                    <button class="btn btn-secondary" onclick="app.deleteGoal(${goal.id})">Delete</button>
                    ${!goal.completed ? `<button class="btn btn-primary" onclick="app.markGoalComplete(${goal.id})">Mark Complete</button>` : ''}
                </div>
            </div>
        `}).join('');
    }

    checkGoalProgress() {
        let completedGoal = null;
        
        // Update progress for all goals based on current metrics
        this.userData.goals.forEach(goal => {
            if (!goal.completed) {
                let previousProgress = goal.progress;
                
                switch(goal.type) {
                    case 'steps':
                        goal.progress = this.userData.metrics.steps;
                        break;
                    case 'water':
                        goal.progress = this.userData.metrics.water;
                        break;
                    case 'sleep':
                        goal.progress = this.userData.metrics.sleep;
                        break;
                    case 'calories':
                        goal.progress = this.userData.metrics.calories;
                        break;
                    case 'exercise':
                        // Calculate total exercise minutes for today
                        const today = new Date().toDateString();
                        const todayExercises = this.userData.exercises.filter(ex => 
                            new Date(ex.timestamp).toDateString() === today
                        );
                        goal.progress = todayExercises.reduce((total, ex) => total + ex.duration, 0);
                        break;
                }
                
                // Check if goal is completed
                if (goal.progress >= goal.target && previousProgress < goal.target) {
                    goal.completed = true;
                    completedGoal = goal;
                }
            }
        });
        
        this.saveUserData();
        this.updateGoalsList();
        this.updateDashboard();
        
        // Show notification if a goal was completed
        if (completedGoal) {
            this.showNotification(`Congratulations! You've completed your ${completedGoal.type} goal!`, 'success');
        }
    }

    checkWeeklyGoals() {
        // Check if it's the end of the week (Sunday)
        const today = new Date();
        if (today.getDay() === 0) {
            const incompleteGoals = this.userData.goals.filter(goal => 
                goal.period === 'weekly' && !goal.completed
            );
            
            if (incompleteGoals.length > 0) {
                this.showNotification(
                    `You have ${incompleteGoals.length} weekly goal(s) that weren't completed this week. Keep going!`, 
                    'info'
                );
            }
        }
    }

    deleteGoal(goalId) {
        this.userData.goals = this.userData.goals.filter(goal => goal.id !== goalId);
        this.saveUserData();
        this.updateGoalsList();
        this.updateDashboard();
        this.showNotification('Goal deleted successfully', 'info');
    }

    markGoalComplete(goalId) {
        const goal = this.userData.goals.find(g => g.id === goalId);
        if (goal) {
            goal.completed = true;
            goal.progress = goal.target;
            this.saveUserData();
            this.updateGoalsList();
            this.showNotification('Goal marked as complete!', 'success');
        }
    }

    updateProgressCharts() {
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

    formatGoalType(type) {
        const types = {
            steps: 'Daily Steps',
            water: 'Water Intake',
            sleep: 'Sleep Duration',
            calories: 'Calorie Intake',
            exercise: 'Exercise Minutes'
        };
        return types[type] || type;
    }

    initCharts() {
        // Chart initialization code remains the same...
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
    console.log('=== WELLNEST APP STARTING ===');
    window.app = new WellNestApp();
});