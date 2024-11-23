import { sendAuthRequest } from "../api.js";
import { fetchImageUrl, fetchProductDetail } from "../utils.js";
import {me} from '../auth.js';
import {  orderStatusColor } from "../constants.js";

document.addEventListener("DOMContentLoaded",async function(e){
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");
    const tblBody = document.getElementById('order-summary-tbody');  
 

    let id = document.getElementById("order-id");
    let orderDate = document.getElementById("order-date");
    let orderStatus = document.getElementById("order-status");
    let username = document.getElementById("username");
    let shipAddress = document.getElementById("ship-address");
    let phone = document.getElementById("phone");
    let expectedDate = document.getElementById("order-expected-date");
    let updatedDate = document.getElementById("status-updated-date");
    let orderTotal = document.getElementById("order-total")

    let response = await sendAuthRequest(`/orders/detail?id=${orderId}`, "GET");
    if(response.ok){
        let order = await response.json();
        let user = await me();
  
        username.innerText = user.name;
        id.innerText  = order.id
        shipAddress.innerText =order.address || "- - -"
        phone.innerText = order.phone
        orderStatus.innerText  =  order.status.toUpperCase()
        orderStatus.style.color = orderStatusColor[order.status] || "blue"


    
        let createdDate = new Date(order.created_at);
        let orderDateStr = createdDate.toLocaleDateString(); 
        let orderTime = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
        orderDate.innerText  =`${orderDateStr} ${orderTime}`
 
        let expectedDateStr = "Still processing"
        expectedDate.style.color = "orange"
 
        if(order.expected_arrived_date.length > 0){
            let expectedDateObj = new Date(order.expected_arrived_date);
            expectedDateStr = expectedDateObj.toLocaleDateString();
            expectedDateStr.style.color = "green" 
        }
        expectedDate.innerText =  expectedDateStr


        let updatedDateObj = new Date(order.updated_at);
        let updatedDateStr = updatedDateObj.toLocaleDateString(); 
        let updatedTime = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
        updatedDate.innerText = `${updatedDateStr} ${updatedTime}`
        let totalAmount = 0.0
        for (const item of order.order_products	) {
            const discountPercent = item.discountPercentAtOrder || 0;
            const discountAmount = (item.priceAtOrder * discountPercent) / 100;
            const discountedPrice = item.priceAtOrder - discountAmount;
    
            const row = document.createElement("tr");

            let product = await fetchProductDetail(item.productId)
            let objectUrl = await fetchImageUrl(product.imageUrl)
    
            let rowTotal =parseFloat( (discountedPrice * item.quantity).toFixed(2))
            row.innerHTML = `
                <td>
                    <img style="width:120px; height: 120px;" src="${objectUrl}" alt="${product.name}" class="cart-product-image" />
                </td>
                <td>${product.name}</td>
                <td>${discountPercent}%</td>
                <td>$${discountedPrice.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td class="grand-total">$${rowTotal}</td>
            `;
    
            totalAmount += rowTotal
            tblBody.appendChild(row);
        
 
        } 

        orderTotal.innerText = `$ ${totalAmount}`
    }else{
        alert("Failed to load order!")
    }
 

})