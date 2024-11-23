import { sendAuthRequest } from "../api.js";

document.addEventListener("DOMContentLoaded",async function(e){
 

    let response = await sendAuthRequest("/users/list", "GET");
    if(response.ok){
        let users = await response.json()
        console.log(users)
    }
    

})