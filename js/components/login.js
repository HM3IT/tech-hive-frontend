import { signin } from '../auth.js';
import {getCookie, showAlert } from '../utils.js';
import {TOKEN_NAME} from '../constants.js';

addEventListener("DOMContentLoaded", (e) => {
    if (getCookie(TOKEN_NAME)){
        showAlert("Already Sign In", "#ff4d4d")
        window.location.href= "./index.html"
    }

    let loginForm =  document.getElementById("login-form")
    loginForm.addEventListener("submit", signin)

    function togglePassword() {
        let field = document.getElementById('signin-password');
        field.type = field.type === 'password' ? 'text' : 'password';
    }
    document.getElementById('show-password').addEventListener("change", togglePassword);
 
});

