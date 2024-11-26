import { sendAuthRequest } from '../api.js';
import {me} from '../auth.js';
import {getMyOrders, fetchImageUrl, uploadImage} from '../utils.js';


document.addEventListener("DOMContentLoaded", async function(event){
    let newImgUrl = ""
    let uploadedImg = document.getElementById("preview-profile-img");
    let profileImg = document.getElementById("profile-img");
 
    
    let email = document.getElementById("email");

    let address = document.getElementById("address");
    let changeAddress = document.getElementById("changeAddress");

    let name = document.getElementById("name");
    let changeName = document.getElementById("changeName");

    let customerLevel = document.getElementById("userLevel");
    
    
    let profileUpdateForm = document.getElementById('profile-update-form');
    let profileUploadBtn = document.getElementById('uploadProfilePhoto');

    profileUploadBtn.addEventListener('change', profileHandler);
    profileUpdateForm.addEventListener('submit',updateUserInfo)


    await loadProfile();
    await loadMyOrder();
   
    
   async function loadMyOrder(){
       const orderContainer = document.getElementById("order-cart-container")
       if (!orderContainer){
         return
       }
       getMyOrders()
       .then(myOrders => {
        myOrders.forEach(order => {
        const orderCard = document.createElement("div");
        orderCard.classList.add("order-card");
        const createdDate = new Date(order.createdAt);
   
        let orderDateStr = createdDate.toLocaleDateString(); 
        let orderTime = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format: HH:MM
        console.log(orderTime);
   
 
        orderCard.innerHTML = `
            <h5>Order #${order.id}</h5>
            <p><strong>Date:</strong> ${orderDateStr} ${orderTime}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
            <a href=orderDetail.html?orderId=${order.id}  class="btn btn-outline-primary btn-sm">View Details</a>
        `;

        orderContainer.appendChild(orderCard);
        });
     
       })
       .catch(error => {
           console.error('Error fetching orders:', error);
       });
    
    }


        
    async function loadProfile() {
        let response  = await me();
  
        name.innerText = response.name;
        changeName.value = response.name;

        
        address.innerText = response.address || "---";
        if (changeAddress){

            changeAddress.value = response.address;
        }
        if (customerLevel){

            customerLevel.innerText = response.userLevel;
        }
        email.innerText = response.email;
        newImgUrl = response.imageUrl;
       
        
        if (newImgUrl!=null && newImgUrl != ""){
            let objectUrl = await fetchImageUrl(newImgUrl);
            profileImg.src = objectUrl;
            
        }else{
            profileImg.src = "../static/images/default-avatar-profile.jpg"
        }
    }
    async function updateUserInfo(event){
        event.preventDefault(); 
        const formData = new FormData(profileUpdateForm);  

    
        const newUserData = {};
        formData.forEach((value, key) => {
            newUserData[key] = value;
        });
        newUserData["newImageUrl"] = newImgUrl
        console.log(newUserData)

        let response = await sendAuthRequest("/users/update", "PATCH", newUserData)
        if (response.ok){
            alert("Successfully updated");
            await loadProfile();
            profileUpdateForm.reset();
        }else{
            let error = await response.json()
            alert(`${error.detail || error.message }`);
        }
    }

    async function profileHandler(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImg.src = e.target.result;
            };
            reader.readAsDataURL(file);

            newImgUrl = await uploadImage(file);
        }
    };
 
})
