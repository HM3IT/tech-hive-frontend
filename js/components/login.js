import { signin } from '../auth.js';
import {TOKEN_NAME, getCookie } from '../utils.js';

addEventListener("DOMContentLoaded", (e) => {
    if (getCookie(TOKEN_NAME)){
        alert("already sign in")
        window.location.href= "/index.html"
    }

    let loginForm =  document.getElementById("login-form")
    loginForm.addEventListener("submit", signin)

    function togglePassword() {
        let field = document.getElementById('signin-password');
        field.type = field.type === 'password' ? 'text' : 'password';
    }
    let el = document.getElementById('show-password'); 
 
 
    el.addEventListener("change", togglePassword);
});


