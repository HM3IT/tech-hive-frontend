import { logout  } from "../auth.js";

window.addEventListener("load", (e) => {


    loadComponent("nav.html", "nav")
    .then(message => console.log(message))
    .catch(error => console.error(error));


    loadComponent("footer.html", "footer")
    .then(message => console.log(message))
    .catch(error => console.error(error));

    
    console.log("HEllo")
    setTimeout(() => {
        let closeBtn =  document.getElementById('logout-btn')
        console.log(closeBtn)
        closeBtn.addEventListener('click', logout);
    }, 2000);
    
 
})