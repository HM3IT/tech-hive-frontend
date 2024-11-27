import { sendAuthRequest } from "../api.js";
import { getUser, getOrders ,createPagination, displayOrderTable } from "../utils.js";

 
const limit = 10
const page = 1
let searchId = ""

const orderCard = document.getElementById("total-order")
const userCard = document.getElementById("total-user")
const salesCard = document.getElementById("total-sales")
const productCard = document.getElementById("total-product")

const weeklyOrderTrendChart = document.getElementById('order-trend-chart');
const monthlyRevenueChart = document.getElementById('monthly-revenue-chart');

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


    const orderTrendDataset = await getWeeklyOrderTrend()
    await generateLineChart(weeklyOrderTrendChart, orderTrendDataset);

 

 
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
        salesCard.innerText = Math.round(data.sales)
        productCard.innerText = data.products;
        userCard.innerText = data.users;

    })
    .catch((err)=>console.log(err))


}


async function getWeeklyOrderTrend(){
 

 let response = await sendAuthRequest(`/statistics/orders/trend`, "GET");
 if (response.ok){
    let data = await response.json()
    console.log(data)
    return data
 }
}




async function generateLineChart(canvasElement, data) {
    if (!canvasElement || !data) {
        return;
    }

    const startDate = new Date(data.date_range.start_date);
    const endDate = new Date(data.date_range.end_date);

    const dateRange = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dateRange.push(new Date(d));
    }


    const labels = dateRange.map(date => {
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });  
        const fullDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); 
        return `${fullDate} (${dayOfWeek})`;
    });
    
    const datasetData = dateRange.map(date => {
        const dateString = date.toISOString().split('T')[0];  
        const trendEntry = data.trend.find(entry => entry.date === dateString);
       
        return trendEntry ? trendEntry.count : 0;  
    });
    
 
    const ctx = canvasElement.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, 
            datasets: [{
                label: 'Daily Orders Trends',
                data: datasetData,  
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                tooltip: { enabled: true }
            },
            scales: {
                x: { title: { display: true, text: 'Day of the Week' } },
                y: { title: { display: true, text: 'Number of Orders' }, ticks: { stepSize: 1 } }  
            }
        }
    });
}
