import { sendAuthRequest } from "../api.js";
import { fetchImageUrl } from "../utils.js";
 
document.addEventListener("DOMContentLoaded", async () => {
    const tblBody = document.getElementById("product-tbl-body")
   
    await DisplayProducts();

    tblBody.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-btn")) {
            let productId = e.target.dataset.productId;
            await deleteProduct(productId);
        }
    });


async function DisplayProducts() {
    let currentPage = 1; 
    let pageSize = 100;  

    let url = `/products/list?currentPage=${currentPage}&pageSize=${pageSize}`;
    let response = await sendAuthRequest(url, "GET", null);

    if (response.ok) {
        let data = await response.json();
        populateProductTable(data.items);
    } else {
        console.log("Failed to fetch products:", response);
    }
}

async function populateProductTable(products) {
  
    tblBody.innerHTML = ""; 


    products.forEach(async (product) => {
        let row = document.createElement("tr");
        let objectUrl = await fetchImageUrl(product.imageUrl);
        row.innerHTML = `
            <td><img src="${objectUrl}" alt="Product Image" class="product-image"></td>
            <td>${product.name}</td>
            <td>${product.brand}</td>
            <td>${product.category.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <span class="status ${product.stock > 0 ? "available" : "unavailable"}">
                ${product.stock > 0 ? product.stock : "Out of Stock"}
                </span>
            </td>
            <td>
                <a href="product_detail.html?productId=${product.id}" style="text-decoration: none;">
                    <button class="view-btn">View</button>
                </a>
                <a href="updateProduct.html?productId=${product.id}" style="text-decoration: none;">
                    <button class="edit-btn">Edit</button>
                </a>
                <button class="delete-btn" data-product-id="${product.id}">Delete</button>
            </td>
        `;
        tblBody.appendChild(row);
    });
}

});