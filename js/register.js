// register.js
import { signup } from './auth.js';
import { getCookie } from './utils.js';
import { TOKEN_NAME } from './constants.js';

document.addEventListener("DOMContentLoaded", () => {
    // Redirect if already signed in
    if (getCookie(TOKEN_NAME)) {
        alert("You are already signed in");
        window.location.href = "./index.html";
    }

 
    let signUpForm = document.getElementById("signup-form");
    signUpForm.addEventListener("submit", function(event){
        event.preventDefault(); 
        
        let passwordField = document.getElementById('signup-password');
        let password = passwordField.value;
 
        if (!isValidPassword(password)) {
            alert("Password must be at least 8 characters long and include at least one special character.");
            return;
        }
 
        signup();
    });

    // Toggle password visibility
    let showPasswordCheckbox = document.getElementById('show-password');
    showPasswordCheckbox.addEventListener("change", () => {
        togglePassword('signup-password');
    });
``
    function togglePassword(fieldId) {
        let field = document.getElementById(fieldId);
        field.type = field.type === "password" ? "text" : "password";
    }

    function isValidPassword(password) {
        let specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/; // Define special characters
        return password.length >= 8 && specialCharacterRegex.test(password);
    }
});
