import { logout  } from "../auth.js";

window.addEventListener("load", (e) => {
    console.log("HEllo")
    setTimeout(() => {
        let closeBtn =  document.getElementById('logout-btn')
        console.log(closeBtn)
        closeBtn.addEventListener('click', logout);
    }, 2000);
    
 
})