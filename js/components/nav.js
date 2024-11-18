import { logout  } from "../auth.js";

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