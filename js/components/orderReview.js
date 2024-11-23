import { sendAuthRequest } from "../api.js";
import { fetchImageUrl, fetchProductDetail, getUser, getUsers } from "../utils.js";
import {  orderStatusColor } from "../constants.js";

 
let order = null
const tblBody = document.getElementById('order-summary-tbody');  
const orderStatusDropdown = document.getElementById("order-status");
const handleByDropdown = document.getElementById('handle-by');
const orderReviewForm = document.getElementById("order-review-form");
const expectedDate = document.getElementById("order-expected-date");

let selectedOrderStatus = null
let selectedHandlerId = null
let id = document.getElementById("order-id");
let orderDate = document.getElementById("order-date");
let username = document.getElementById("username");
let shipAddress = document.getElementById("ship-address");
let phone = document.getElementById("phone");
let orderTotal = document.getElementById("order-total");

document.addEventListener("DOMContentLoaded",async function(e){
    const params = new URLSearchParams(window.location.search);
    let orderId = params.get("orderId");
    await loadOrderInfo(orderId);
    let data = await getUsers(1, 250);
    let users = data.items;
    
    let handlers = users.filter((user)=>user.isSuperuser)
    loadHandleByDropdown(handlers, selectedHandlerId)
    loadOrderStatusDropdown(selectedOrderStatus)
    orderReviewForm.addEventListener("submit", updateOrder);
})

 
async function updateOrder(event) {
 
    event.preventDefault();
    console.log(order)
    if(!order){
        return
    }
   
    let orderStatus = orderStatusDropdown.value;
    let handlerId = handleByDropdown.value.trim();
    let expectedOrderDate = expectedDate.value;
   
    if (order.status===orderStatus && order.handler_id== handlerId && order.expected_arrived_date.length >=0){
        alert("You haven't updated any information")
        return
    }
    

    const updateOrderData = {
        id:order.id,
        orderStatus: orderStatus,
        handlerId: handlerId,
        expectedArrivedDate: expectedOrderDate + "T00:00:00"
    };
    console.log("updateOrderData")
    console.log(updateOrderData)
    let response = await sendAuthRequest("/orders/update", "PATCH", updateOrderData)
 
    if(response.ok){
        let data = await response.json();
        console.log(data)
        alert("Order successfully updated!");
        window.location.reload()
    }


};


function loadHandleByDropdown(users, selectedHandlerId) {
    
    handleByDropdown.innerHTML = '<option value="" disabled selected>Select handler</option>';
    
    users.forEach(user => {
        const option = document.createElement('option');
        if(selectedHandlerId && selectedHandlerId == user.id){
            option.selected = true;
            handleByDropdown.style.color = "green"
        }
        option.value = user.id;  
        option.textContent = user.name;  
        handleByDropdown.appendChild(option);
    });
}


function loadOrderStatusDropdown(selectedStatus=null) {
    
    orderStatusDropdown.innerHTML = '<option value="" disabled selected>Select status</option>';
    for (const [status, color] of Object.entries(orderStatusColor)) {
        const option = document.createElement("option");
        if(selectedStatus && status == selectedStatus){
            option.selected = true;
            orderStatusDropdown.style.color = color
        }
        option.value = status;
        option.textContent = status.charAt(0).toUpperCase() + status.slice(1); 
        orderStatusDropdown.appendChild(option);
    }
}

orderStatusDropdown.addEventListener('change', function() {
    let selectedOption = orderStatusDropdown.options[orderStatusDropdown.selectedIndex];
    let selectedColor = orderStatusColor[selectedOption.value];  
    orderStatusDropdown.style.color = selectedColor;
 
});


async function loadOrderInfo(orderId){
    let response = await sendAuthRequest(`/orders/detail?id=${orderId}`, "GET");
    if(response.ok){
        order = await response.json();
    
        let user = await getUser(order.user_id);
        username.innerText = user.name;
        id.innerText  = order.id;
        shipAddress.innerText =order.address || "- - -";
        phone.innerText = order.phone;

        selectedOrderStatus = order.status;
        selectedHandlerId = order.handler_id
        let createdDate = new Date(order.created_at);
        let orderDateStr = createdDate.toLocaleDateString(); 
        let orderTime = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
        orderDate.innerText  =`${orderDateStr} ${orderTime}`
 
        expectedDate.style.color = "orange"
        if(order.expected_arrived_date.length > 0){
            let expectedDateObj = new Date(order.expected_arrived_date);
            let expectedDateStr = expectedDateObj.toISOString().split('T')[0];
            expectedDate.value = expectedDateStr;
            // not allowing users to change the shipped date once it is set 
            expectedDate.disabled = true;
            expectedDate.style.color = "green";
            expectedDate.style.backgroundColor= "#dde6f0"
        }

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
                <td>
                    <a href="productDetail.html?productId=${item.productId}" style="text-decoration: none;">
                        <button style="color:white;" class="view-btn">View</button>
                    </a>
                </td>
                `;
    
            totalAmount += rowTotal
            tblBody.appendChild(row);
        
 
        } 

        orderTotal.innerText = `$ ${totalAmount}`
    }else{
        alert("Failed to load order!")
    }
}