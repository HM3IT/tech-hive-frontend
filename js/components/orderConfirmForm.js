import {sendAuthRequest} from "../api.js";
import {fetchImageUrl} from "../utils.js";

document.addEventListener("DOMContentLoaded",async function(){
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let grandTotal = await getGrandTotal();
    let userName = document.getElementById("user-name");
    let shipAddress = document.getElementById("ship-address");
    let phone = document.getElementById("phone");
    let orderSubmitBtn = document.getElementById("order-submit-btn");
    const tblBody = document.getElementById("order-summary-tbody");

    orderSubmitBtn.addEventListener("click", submitOrder);

    const response = await sendAuthRequest("/access/me", "GET");
    if(response.ok){
        let user = await response.json();
        userName.innerText = user.name;
        shipAddress.innerText = user.address || "";
    }

    const grandTotalElement = document.getElementById('order-total');
    grandTotalElement.innerText = `$${grandTotal.toFixed(2)}`;
    
 
    loadCartSummaryTable(cart);

    async function getGrandTotal(){
        return cart.reduce((total, item) => {
            const discountPercent = item.discountPercentAtOrder || 0;
            const discountAmount = (item.priceAtOrder * discountPercent) / 100;
            const discountedPrice = item.priceAtOrder - discountAmount;
            return total + discountedPrice * item.quantity;
    }, 0);

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
            totalPrice: await getGrandTotal(), // avoid HTML snopping
            phone: phone.innerText
        };
     
        let response = await sendAuthRequest("/orders/add","POST", orderData)
        if (response.ok){
            alert("Order is placed successfully")
            let orderData = await response.json();
    
            localStorage.setItem('cart', null)
            window.location.href = "products.html"
    
            console.log(orderData)
        }
    }
        
    async function loadCartSummaryTable(cart) {
        const tblBody = document.getElementById('order-summary-tbody');  
        if (!tblBody) {
            return;
        }
        tblBody.innerHTML = '';
    
        for (const item of cart) {
            const discountPercent = item.discountPercentAtOrder || 0;
            const discountAmount = (item.priceAtOrder * discountPercent) / 100;
            const discountedPrice = item.priceAtOrder - discountAmount;
            const objectUrl = await fetchImageUrl(item.imageUrl);
    
         
            const row = document.createElement("tr");
            row.setAttribute("data-index", cart.indexOf(item));
            row.setAttribute("data-id", item.productId);
    
    
            row.innerHTML = `
                <td>
                    <img style="width:120px; height: 120px;" src="${objectUrl}" alt="${item.name}" class="cart-product-image" />
                </td>
                <td>${item.name}</td>
                <td>${discountPercent}%</td>
                <td>$${discountedPrice.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td class="grand-total">$${(discountedPrice * item.quantity).toFixed(2)}</td>
            `;
    
         
            tblBody.appendChild(row);
        }
 
    }
    
})