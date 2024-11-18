import { logout  } from "../auth.js";
import { getCookie,TOKEN_NAME } from "../utils.js";

window.addEventListener("load", (e) => {


    loadComponent("nav.html", "nav")
    .then(message => console.log(message))
    .catch(error => console.error(error));


    loadComponent("footer.html", "footer")
    .then(message => console.log(message))
    .catch(error => console.error(error));

    const checkDomAndAttachListener = () => {
        const closeBtn = document.getElementById('logout-btn');
        if (closeBtn) {
            console.log("found")
            closeBtn.addEventListener('click', logout);
            console.log("Listener attached to logout button.");
            clearInterval(interval); // Stop the interval once the element is found
        }
    };
    
    const interval = setInterval(checkDomAndAttachListener, 500);
 
})


window.addEventListener("DOMContentLoaded", () => {
    // Initialize navigation logic
    const navCheckInterval = setInterval(() => {
        const loginMenu = document.getElementsById("auth-bar");
        if (loginMenu) {
            clearInterval(navCheckInterval);
            initializeNav(loginMenu);
        }
    }, 100); // Check every 100ms until navigation is loaded
});

function initializeNav(loginMenu) {
    const isLoggedIn = getCookie(TOKEN_NAME);

    if (isLoggedIn) {
        // Replace menu with logout option
        loginMenu.innerHTML = `<li><a href="#" id="logout-link">Logout</a></li>;`
        const logoutLink = document.getElementById("logout-link");
        logoutLink.addEventListener("click", logout);
        loginMenu.getElementById("profile-btn")
    } else {
        // Replace menu with login/signup options
        loginMenu.innerHTML = 
            `<li><a href="login.html">Login</a></li>
            <li><a href="register.html">Sign Up</a></li>`
        ;
    }
}