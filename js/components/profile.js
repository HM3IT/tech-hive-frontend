import {me} from '../auth.js';


document.addEventListener("DOMContentLoaded", loadProfile)
let img = document.getElementById("profile-img");
let name = document.getElementById("name");
let email = document.getElementById("email");
let address = document.getElementById("address");
let customerLevel = document.getElementById("userLevel");

async function loadProfile() {
    let response  = await me();
    console.log(response)
    // { id: "d96934fd-fb49-443e-83ff-76e8e6f64bf5", email: "newuser@gmail.com",
 
    name.innerText = response.name
    customerLevel.innerText = response.userLevel
    address.innerText = response.address
    email.innerText = response.email
    if (response.imageUrl){
        
    }
    //  img.setAttribute('src',)

}