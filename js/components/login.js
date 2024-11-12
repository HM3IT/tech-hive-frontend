import { signin } from '../auth.js';

addEventListener("DOMContentLoaded", (e) => {
    let loginForm =  document.getElementById("login-form")
    loginForm.addEventListener("submit", signin)

});

function togglePassword() {
    var field = document.getElementById('password');
    field.type = field.type === 'password' ? 'text' : 'password';
}
