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


const email = document.getElementById(
