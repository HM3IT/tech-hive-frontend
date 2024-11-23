import { sendAuthRequest } from "../api.js";
import { getUser, createPagination } from "../utils.js";
import {  orderStatusColor } from "../constants.js";
 
const limit = 1
const page = 1
let filter = ""

document.addEventListener("DOMContentLoaded", async () => {

   
    let data = await getOrders(page, limit);
  
    createPagination(data.total, data.perPage, getOrders, displayOrderTable, filter);
 
})





async function getOrders(page, limit) {
  
    let url = `/orders/admin/list?currentPage=${page}&pageSize=${limit}`;
    let response = await sendAuthRequest(url, "GET", null);

    if (response.ok) {
        let data =  await response.json();
        return {
            total: data.total, 
            items: data.items,
            perPage: data.limit
          };
   
    } else {
        console.log("Failed to fetch products:", response);
    }
}

async function displayOrderTable(orders) {
    const tblBody = document.getElementById("order-tbl-body")

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

    tblBody.addEventListener("click", async (e) => {
        if (e.target.classList.contains("update-btn")) {
            let orderId = e.target.dataset.id;
            window.location.href=`orderStatusForm.html?productId=${orderId}`
        }
    });
}
