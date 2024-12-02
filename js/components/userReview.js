import { sendAuthRequest } from '../api.js';
import {me} from '../auth.js';
import {getOrdersByUserId, fetchImageUrl, uploadImage, showAlert} from '../utils.js';


document.addEventListener("DOMContentLoaded", async function(event){

    
    const params = new URLSearchParams(window.location.search);
    let userId = params.get("userId");
    if (!userId){
        showAlert("User ID Invalid!", "#ff4d4d")
    }


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

    if(profileUploadBtn){

        profileUploadBtn.addEventListener('change', profileHandler);
        profileUpdateForm.addEventListener('submit',updateUserInfo)
    }


    await loadProfile(userId);
    await loadMyOrder(userId);
   
    
   async function loadMyOrder(){
       const orderContainer = document.getElementById("order-cart-container")
       if (!orderContainer){
         return
       }
       getOrdersByUserId(userId)
       .then(myOrders => {
        myOrders.forEach(order => {
        const orderCard = document.createElement("div");
        orderCard.classList.add("order-card");
        const createdDate = new Date(order.createdAt);
   
        let orderDateStr = createdDate.toLocaleDateString(); 
        let orderTime = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format: HH:MM
   
 
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


        
    async function loadProfile(userId) {
        let response  = await sendAuthRequest(`/users/detail/${userId}`,"GET");
        if (!response.ok){
            showAlert("Failed To Retrieved Users!", "#ff4d4d")
        } 
        response  = await response.json()
  
        name.innerText = response.name;
        address.innerText = response.address || "---";


        
        if(profileUpdateForm){
            changeName.value = response.name;
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
            profileImg.src = "../static/default-avatar-profile.jpg"
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

        let response = await sendAuthRequest("/users/update", "PATCH", newUserData)
        if (response.ok){
            showAlert("Successfully Updated.", "#28a745");
            await loadProfile();
            profileUpdateForm.reset();
        }else{
            let error = await response.json()
            showAlert(`${error.detail || error.message }`, "#ff4d4d");
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
