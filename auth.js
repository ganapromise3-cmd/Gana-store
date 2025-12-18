const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// --- CONSTANTS ---
const USERS_STORAGE_KEY = 'GANA_simulated_users';
const INITIAL_CART_DATA = JSON.stringify([]); // Empty cart for a new user

// --- UTILITY FUNCTIONS ---

/**
 * Toggles visibility between the Login and Signup forms.
 */
function toggleForms() {
    loginSection.classList.toggle('hidden');
    signupSection.classList.toggle('hidden');
}

/**
 * Retrieves the list of simulated users from localStorage.
 */
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
}

/**
 * Saves the current user session details to sessionStorage.
 * In a real app, this would be a secure, expiring token.
 */
function setSession(userId) {
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('currentUserId', userId);
    window.location.href = 'index.html'; // Redirect to the product page
}

// --- FORM HANDLERS ---

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    let users = getUsers();

    if (users.some(u => u.email === email)) {
        alert('Signup Failed: An account with this email already exists.');
        return;
    }
    
    // Simple password check (in a real app, this would be on the backend)
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    // Simulate a secure, unique ID (using timestamp for simplicity)
    const newUserId = Date.now().toString(); 
    
    // NOTE: NEVER store raw passwords in localStorage in a real application!
    // This is for simulation purposes only.
    const newUser = {
        id: newUserId,
        username: username,
        email: email,
        password: password // SIMULATION ONLY!
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    // Initialize an empty cart for the new user
    localStorage.setItem(`cart_${newUserId}, INITIAL_CART_DATA`);

    alert('Signup successful! Please log in.');
    toggleForms(); // Switch back to login
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = getUsers();
    
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert(`Welcome back, ${user.username}!`);
        setSession(user.id);
    } else {
        alert('Login Failed: Invalid email or password.');
    }
});

// --- INITIALIZATION ---
showSignupBtn.addEventListener('click', toggleForms);
showLoginBtn.addEventListener('click', toggleForms);