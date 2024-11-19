import { sendAuthRequest } from "../api.js";
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

window.addEventListener("DOMContentLoaded",async () => {

    async function updateNavBar(){
        const TOKEN = getCookie(TOKEN_NAME);
        let authBtns = document.getElementsByClassName("auth-btns");
        let unauthBtns = document.getElementsByClassName("unauth-btns");
        if (!TOKEN) {
            Array.from(authBtns).forEach((btn) => (btn.style.display = "block"));
            Array.from(unauthBtns).forEach((btn) => (btn.style.display = "none"));
        } else {
            try {
                const response = await sendAuthRequest("/access/me", "GET");

                if (response.ok) {
                    const data = await response.json();
                    console.log(`Welcome, ${data.name}`);
               
                    Array.from(authBtns).forEach((btn) => (btn.style.display = "block"));
                    Array.from(unauthBtns).forEach((btn) => (btn.style.display = "none"));
                } else {
                    // Show unauthenticated buttons
                    console.log("Failed to retrieve user data");
                    Array.from(authBtns).forEach((btn) => (btn.style.display = "none"));
                    Array.from(unauthBtns).forEach((btn) => (btn.style.display = "block"));
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
             
                Array.from(authBtns).forEach((btn) => (btn.style.display = "none"));
                Array.from(unauthBtns).forEach((btn) => (btn.style.display = "block"));
            }
        }
    }
    // initial loading
    setTimeout(() => {
        updateNavBar();
    }, 1000);

    setInterval(async () => {
       await updateNavBar()
    }, 10000); 
});


 