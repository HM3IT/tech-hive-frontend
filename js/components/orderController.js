import { sendAuthRequest } from "../api.js";
import { getUser } from "../utils.js";
import {  orderStatusColor } from "../constants.js";
 
document.addEventListener("DOMContentLoaded", async () => {
    const tblBody = document.getElementById("order-tbl-body")
   
    let data = await loadOrders();
    await loadOrderTable(data.items);

    tblBody.addEventListener("click", async (e) => {
        if (e.target.classList.contains("update-btn")) {
            let orderId = e.target.dataset.id;
            window.location.href=`orderStatusForm.html?productId=${orderId}`
        }
    });


async function loadOrders() {
    let currentPage = 1; 
    let pageSize = 10;  

    let url = `/orders/admin/list?currentPage=${currentPage}&pageSize=${pageSize}`;
    let response = await sendAuthRequest(url, "GET", null);

    if (response.ok) {
        return  await response.json();
   
    } else {
        console.log("Failed to fetch products:", response);
    }
}

async function loadOrderTable(orders) {
  
    tblBody.innerHTML = ""; 


    orders.forEach(async (order) => {
        let row = document.createElement("tr");
        let user = await getUser(order.userId)
        let createdDate = new Date(order.createdAt);
        let orderDateStr = createdDate.toLocaleDateString(); 
        let orderTime = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
        let colorStr = orderStatusColor[order.status]
        let status = order.status.toUpperCase()
        
        row.innerHTML = `
            <tr>
                <td>${order.id}</td>
                <td>${user.name}</td>
                <td>${orderDateStr} ${orderTime}</td>
                <td class='order-status' style="color:${colorStr}">${status}</td>
                <td>$${order.totalPrice}</td>
                <td class="action-buttons">
                    <a class="review-btn" data-id="${order.id}" href="orderReview.html?orderId=${order.id}">Review</a>
                </td>
            </tr>
        `;
        tblBody.appendChild(row);
    });
}

})