import {sendAuthRequest} from "../api.js";

document.addEventListener("DOMContentLoaded",async function(){
    let userName = document.getElementById("user-name");
    let shipAddress = document.getElementById("ship-address")
    let phone = document.getElementById("phone")
    const response = await sendAuthRequest("/access/me", "GET");
    if(response.ok){
        let user = await response.json();
 
        userName.innerText = user.name
        shipAddress.innerText = user.address || "";
    }

    async function submitOrder(){
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
     
        if (!cart || cart.length <= 0){
            alert("Please add products")
            return
        }
        let shipAddress = document.getElementById("ship-address")
        let orderData = {
            orderProducts: cart,
            address: shipAddress.innerText.trim(),
            totalPrice: grandTotal,
            phone: phone.innerText.trim()
        };
     
        let response = await sendAuthRequest("/orders/add","POST", orderData)
        if (response.ok){
            alert("Order is placed successfully")
            let orderData = await response.json();
    
            // deleting old cart data
            localStorage.setItem('cart', null)
            window.location.reload();
    
            console.log(orderData)
        }
    }





    let orderSubmitBtn = document.getElementById("order-submit-btn");
    orderSubmitBtn.addEventListener("click", submitOrder)
 


async function loadOrderTable(orders) {
  
        tblBody.innerHTML = ""; 
    
    
        orders.forEach(async (order) => {
            let row = document.createElement("tr");
            let user = await getUser(order.userId)
       
            row.innerHTML = `
                <tr>
                    <td>${order.id}</td>
                    <td>${user.name}</td>
                    <td>${order.createAt}</td>
                    <td>${order.status}</td>
                    <td>${order.totalPrice}</td>
                    <td class="action-buttons">
                        <button class="view-btn" data-id="${order.id}">View</button>
                        <button class="update-btn" data-id="${order.id}">Update</button>
                    </td>
                </tr>
            `;
            tblBody.appendChild(row);
        });
    }
    
})