import { sendAuthRequest } from "../api.js";
import { getUser, getOrders ,createPagination, displayOrderTable } from "../utils.js";

 
const limit = 10
const page = 1
let searchId = ""

document.addEventListener("DOMContentLoaded", async () => {

    let data = await getOrders(page, limit);
    const tblBody = document.getElementById("order-tbl-body")
    const filterDate = document.getElementById("filter-date");

    filterDate.addEventListener("change", (event) => {
        const selectedDate = event.target.value;
        console.log("Selected Date:", selectedDate);
    });
    await displayOrderTable(data.items, tblBody)
 
})

async function searchOrder(){
    let orderId = document.getElementById("search-input").value.trim()

    if (orderId.length> 0){
        searchId= orderId
        let data = await getOrders(page, limit, searchId );

    }
}


