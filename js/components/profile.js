import {me} from '../auth.js';
import {getMyOrders} from '../utils.js';


document.addEventListener("DOMContentLoaded", async function(){

    let img = document.getElementById("profile-img");
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let address = document.getElementById("address");
    let customerLevel = document.getElementById("userLevel");
 
    
    async function loadProfile() {
        let response  = await me();
        console.log(response)
     
        name.innerText = response.name
        customerLevel.innerText = response.userLevel
        address.innerText = response.address
        email.innerText = response.email
        if (response.imageUrl){
            
        }
    }

    document.getElementById('uploadProfilePhoto').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profile-img').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    await loadProfile();
    await loadMyOrder();
   
    
   async function loadMyOrder(){
       const orderContainer = document.getElementById("order-cart-container")
       getMyOrders()
       .then(myOrders => {
        myOrders.forEach(order => {
        const orderCard = document.createElement("div");
        orderCard.classList.add("order-card");
        const createdDate = new Date(order.createdAt);
        let orderDate = createdDate.toLocaleDateString();
        orderCard.innerHTML = `
            <h5>Order #${order.id}</h5>
            <p><strong>Date:</strong> ${orderDate}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
            <button class="btn btn-outline-primary btn-sm">View Details</button>
        `;

        orderContainer.appendChild(orderCard);
        });
     
       })
       .catch(error => {
           console.error('Error fetching orders:', error);
       });
    
    }
})
