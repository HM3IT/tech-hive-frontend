import { sendAuthRequest } from "../api.js";
import { getUser, getOrders ,createPagination, displayOrderTable, fetchImageUrl } from "../utils.js";


let monthlyCategoryChart = null
let weeklyOrderTrendChart = null

document.addEventListener("DOMContentLoaded", async () => {

    const orderCard = document.getElementById("total-order");
    const userCard = document.getElementById("total-user");
    const salesCard = document.getElementById("total-sales");
    const productCard = document.getElementById("total-product");
    const expenseCard = document.getElementById("total-expense");
    const profitCard = document.getElementById("profit-margin");

    const weeklyOrderTrendChartCanva = document.getElementById('order-trend-chart');
    const monthlyCategoryTrendChartCanva = document.getElementById('trending-category-chart');

    const orderTblBody = document.getElementById("order-tbl-body");
    const productTblBody = document.getElementById("product-tbl-body");

    const filterDate = document.getElementById("filter-date");

    
    await loadAllStatistics()
    filterDate.addEventListener("change", async (event) => {
        const selectedDate = event.target.value;
        await loadAllStatistics(selectedDate)

    })
    

async function  loadAllStatistics(selectedDate = null){
    const encodedDate = selectedDate 
        ? encodeURIComponent(selectedDate) 
        : null;
    const totalStatUrl = `/statistics/total?currentPage=1&pageSize=500&filter_date=${encodedDate}`;
    const weeklyTrendUrl = `/statistics/orders/trend?filter_date=${encodedDate}`;
    const categoryTrendUrl = `/statistics/categories/trend?filter_date=${encodedDate}`;
    const orderTrendUrl =  `/orders/admin/list?currentPage=1&pageSize=5&filter_date=${encodedDate}`
    const productTrendUrl = `/statistics/products/trend?filter_date=${encodedDate}`

    await statisticsHandler(totalStatUrl, displayTotalStatistics);
    await statisticsHandler(weeklyTrendUrl, (data)=>generateLineChart(weeklyOrderTrendChartCanva, data));
    await statisticsHandler(categoryTrendUrl, (data)=>generateMonthlyCategoryChart(monthlyCategoryTrendChartCanva, data));
    await statisticsHandler(orderTrendUrl, (data)=>displayOrderTable(data.items, orderTblBody));
    await statisticsHandler(productTrendUrl, (data)=>displayProductTrendTable(data.trend, productTblBody));

}


async function statisticsHandler(url, displayFunc){
     sendAuthRequest(url, "GET")    
    .then((res)=>res.json())
    .then((data)=>displayFunc(data))
    .catch((err)=>console.log(err))
}


async function generateMonthlyCategoryChart(canvasElement, data) {
    if (!canvasElement) {
        return;
    }
    const ctx = canvasElement.getContext('2d');   

    const startDate = new Date(data.date_range.start_date);
    const monthName = startDate.toLocaleDateString('en-US', { month: 'long' });

    const labels = data.trend.map(entry => entry.name);  
    const revenueData = data.trend.map(entry => entry.revenue);  
    if (monthlyCategoryChart){
        monthlyCategoryChart.destroy();
    }

    monthlyCategoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue',
                data: revenueData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Monthly Category-Wise Revenue (${monthName})`,
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            const category = data.trend[index];
                            return `Revenue: $${category.revenue}, Sold: ${category.sold}`;
                        }
                    }
                }
            },
            indexAxis: 'y',
            scales: {
                x: {
                    title: { display: true, text: 'Revenue ($)' },
                    ticks: {
                        callback: value => `$${value}`, 
                    }
                },
                y: {
                    title: { display: true, text: 'Categories' },
                }
            }
        }
    });
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
    if (weeklyOrderTrendChart){
        weeklyOrderTrendChart.destroy()
    }
    weeklyOrderTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, 
            datasets: [{
                label: 'Weekly Orders Trends',
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


async function displayTotalStatistics(data){
       
    orderCard.innerText = data.orders;
    salesCard.innerText = `$${Math.round(data.revenue)}`
    productCard.innerText = data.products;
    expenseCard.innerText = `$${data.expense}`
    userCard.innerText = data.users;
    profitCard.innerText = data.profit_margin.toFixed(2);

    profitCard.style.color = data.profit_margin >0 ? "green":"red"; 
    expenseCard.style.color = "orange"
    salesCard.style.color = "green"
}

async function displayProductTrendTable(products, tblBody) {
    tblBody.innerHTML = "";  
  
    products.sort((a, b) => a.rank - b.rank); 

    let rank = 1
    for (const product of products) {
        let row = document.createElement("tr");
         
        let objectUrl = await fetchImageUrl(product.image_url);
     
        row.innerHTML = `
            <td>${rank}</td> <!-- Directly show the rank -->
            <td>
                <img src="${objectUrl}" alt="${product.name}" class="product-image card-img-top" style="max-height: 100px;">
            </td>
            <td>${product.name}</td>
            <td>${product.revenue}</td>
            <td>
                 <span class="status ${product.stock > 10 ? "sufficient" : "low"}">
                ${product.stock > 0 ? product.stock : "Out of Stock"}
                </span>
            </td>
            <td>${product.sold}</td>
            <td class="action-buttons">
                <a class="review-btn btn btn-primary btn-sm" data-id="${product.id}" href="productDetail.html?productId=${product.id}">Review</a>
            </td>
        `;
        rank++;
        tblBody.appendChild(row);
        tblBody.addEventListener("click", (e) => {
            if (e.target.classList.contains("review-btn")) {
                let productId = e.target.dataset.id;
                window.location.href = `productDetail.html?productId=${productId}`;
            }
        });
    }
}

});