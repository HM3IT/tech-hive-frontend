import { getUser, getOrders, createPagination } from "../utils.js";
import { orderStatusColor} from "../constants.js";
 
const limit = 10
const page = 1
let searchId = ""

document.addEventListener("DOMContentLoaded", async () => {

    const searchBtn = document.getElementById("search-btn")
    let searchInputBox = document.getElementById("search-input");
    if(searchBtn){

        searchBtn.addEventListener("click", searchOrder);
    }

    searchInputBox.addEventListener("keypress", async function(event) {
        if (event.key === "Enter") {
            await searchOrder()
        }
    });
    

    let data = await getOrders(page, limit);
    createPagination(data.total, data.perPage, getOrders, displayOrderTable, searchId);
 
})

async function searchOrder(){
    let orderId = document.getElementById("search-input").value.trim()

    if (orderId.length> 0){
        searchId= orderId
        let data = await getOrders(page, limit, searchId );
        createPagination(data.total, data.perPage, getOrders, displayOrderTable, searchId);
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
