import { sendAuthRequest } from "../api.js";
import { getUser } from "../utils.js";
 
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
// async function loadOrderTable(orders) {
//     tblBody.innerHTML = "";  

//     for (const order of orders) {
//         const row = document.createElement("tr");
//         const user = await getUser(order.userId);

//         row.innerHTML = `
//             <td>${order.id}</td>
//             <td>${user.name}</td>
//             <td>${order.createAt}</td>
//             <td>${order.status}</td>
//             <td>${order.totalPrice}</td>
//             <td class="action-buttons">
//                 <button class="view-btn" data-id="${order.id}">View</button>
//                 <button class="update-btn" data-id="${order.id}">Update</button>
//             </td>
//         `;

//         tblBody.appendChild(row);
//     }
// }

// });



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