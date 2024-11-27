import { sendAuthRequest } from "../api.js";
import { getUser, getOrders ,createPagination, displayOrderTable } from "../utils.js";

 
const limit = 10
const page = 1
let searchId = ""

const orderCard = document.getElementById("total-order")
const userCard = document.getElementById("total-user")
const salesCard = document.getElementById("total-sales")
const productCard = document.getElementById("total-product")

document.addEventListener("DOMContentLoaded", async () => {

    let data = await getOrders(page, limit);
    const tblBody = document.getElementById("order-tbl-body")
    const filterDate = document.getElementById("filter-date");

    filterDate.addEventListener("change", (event) => {
        const selectedDate = event.target.value;
        console.log("Selected Date:", selectedDate);
    });
    await displayOrderTable(data.items, tblBody)
 
    await getTotalStatistics()
})

async function searchOrder(){
    let orderId = document.getElementById("search-input").value.trim()

    if (orderId.length> 0){
        searchId= orderId
        let data = await getOrders(page, limit, searchId );

    }
}


async function getTotalStatistics(filterDate= ""){
    sendAuthRequest("/statistics/total?currentPage=1&pageSize=500")
    .then((res)=>res.json())
    .then((data)=>{
        console.log(data)
        orderCard.innerText = data.orders;
        salesCard.innerText = data.sales;
        productCard.innerText = data.products;
        userCard.innerText = data.users;

    })
    .catch((err)=>console.log(err))


}


