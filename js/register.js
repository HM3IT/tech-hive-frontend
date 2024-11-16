// register.js
import { signup } from './auth.js';
import { TOKEN_NAME, getCookie } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
    // Redirect if already signed in
    if (getCookie(TOKEN_NAME)) {
        alert("You are already signed in");
        window.location.href = "index.html";
    }

    // Handle the signup form submission
    const signUpForm = document.getElementById("signup-form");
    signUpForm.addEventListener("submit", signup);

    // Toggle password visibility
    const showPasswordCheckbox = document.getElementById('show-password');
    showPasswordCheckbox.addEventListener("change", () => {
        togglePassword('signup-password');
    });
``
    function togglePassword(fieldId) {
        const field = document.getElementById(fieldId);
        field.type = field.type === "password" ? "text" : "password";
    }
});
