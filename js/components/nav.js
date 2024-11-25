import { sendAuthRequest } from "../api.js";
import { logout, me  } from "../auth.js";
import { getCookie, getCategory } from "../utils.js";
import { TOKEN_NAME } from "../constants.js";

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
            closeBtn.addEventListener('click', logout);
            // Stop the interval once the element is found
            clearInterval(interval); 
        }
    };
    
    const interval = setInterval(checkDomAndAttachListener, 500);
 
})


window.addEventListener("DOMContentLoaded",async () => {
    async function loadComponent(){
        let menu = document.getElementById("components-menu");
        let categories = await getCategory();

        menu.innerHTML = '';

        categories.forEach(category => {
        
            let listItem = document.createElement('li');
            listItem.innerHTML = `<a href="products.html?filter_type=${category.name}">${category.name}</a>`;
       
            menu.appendChild(listItem);
        });
            
      
    }

    async function updateNavBar(){
        const TOKEN = getCookie(TOKEN_NAME);
 
        let authBtns = document.getElementsByClassName("auth-btns");
        let unauthBtns = document.getElementsByClassName("unauth-btns");
        if (!TOKEN) {
          
            Array.from(authBtns).forEach((btn) => (btn.style.display = "none"));
            Array.from(unauthBtns).forEach((btn) => (btn.style.display = ""));
        } else {
            try {
                const response = await me();

                if (response) {
 
                    Array.from(authBtns).forEach((btn) => (btn.style.display = ""));
                    Array.from(unauthBtns).forEach((btn) => (btn.style.display = "none"));
                } else {
                    // Show unauthenticated buttons
                    console.log("Failed to retrieve user data");
                    Array.from(authBtns).forEach((btn) => (btn.style.display = "none"));
                    Array.from(unauthBtns).forEach((btn) => (btn.style.display = ""));
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
             
                Array.from(authBtns).forEach((btn) => (btn.style.display = "none"));
                Array.from(unauthBtns).forEach((btn) => (btn.style.display = ""));
            }
        }
    }
    // initial loading wait for js
    let intervalId = setInterval(() => {
        let authBtns = document.getElementsByClassName("auth-btns");
    
        if (authBtns.length > 0) {
        
            console.log("Auth buttons found, updating navbar...");
            updateNavBar();
            loadComponent()
            
            clearInterval(intervalId); 
        }  
    }, 10);

    setInterval(async () => {
       await updateNavBar()
    }, 10000); 
});


 