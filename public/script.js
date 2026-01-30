// Configuration
const API_URL = 'http://localhost:3000/api';

// DOM Elements
const authLinks = document.getElementById('authLinks');
const userMenu = document.getElementById('userMenu');
const navbarUsername = document.getElementById('navbarUsername');

// Sections
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const heroSection = document.getElementById('heroSection');
const profileSection = document.getElementById('profileSection');
const allSections = document.querySelectorAll('section');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); // Check if user is already logged in
    setupEventListeners();
});

function setupEventListeners() {
    // Navigation
    document.getElementById('loginLink').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('loginSection');
    });

    document.getElementById('registerLink').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('registerSection');
    });

    document.getElementById('getStartedButton').addEventListener('click', () => {
        showSection('registerSection');
    });

    document.getElementById('goToRegisterLink').addEventListener('click', () => {
        showSection('registerSection');
    });

    document.getElementById('goToLoginLink').addEventListener('click', () => {
        showSection('loginSection');
    });

    document.getElementById('logoutLink').addEventListener('click', logout);

    // Form Submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

// --- Authentication Logic ---

async function handleLogin(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('loginError');
    errorDiv.classList.add('d-none'); // Hide previous errors

    // 1. Get values from HTML
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // 2. Send POST request to Server
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // 3. Login Success: Save Token & User
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // 4. Update UI
            alert('Login Successful!');
            checkAuth();
        } else {
            // 5. Login Failed
            throw new Error(data.error || 'Login failed');
        }
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('d-none');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('registerError');
    errorDiv.classList.add('d-none');

    // MAPPING: We map the HTML "Email" input to the Server "Username" field
    // because your server expects a 'username', not an email.
    const username = document.getElementById('registerEmail').value; 
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            showSection('loginSection');
        } else {
            throw new Error(data.error || 'Registration failed');
        }
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('d-none');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    checkAuth();
    alert('Logged out successfully');
}

// --- UI Management ---

function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
        // User is Logged In
        authLinks.classList.add('d-none');
        userMenu.classList.remove('d-none');
        navbarUsername.textContent = user.username;
        
        // Populate Profile
        document.getElementById('profileName').textContent = user.username;
        document.getElementById('profileEmail').textContent = "Fetched from Server"; 
        document.getElementById('profileRole').textContent = user.role;

        showSection('profileSection');
    } else {
        // User is Logged Out
        authLinks.classList.remove('d-none');
        userMenu.classList.add('d-none');
        showSection('heroSection');
    }
}

function showSection(sectionId) {
    // Hide all sections
    allSections.forEach(sec => sec.classList.add('d-none'));
    
    // Show specific section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('d-none');
    }
}