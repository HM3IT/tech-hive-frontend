import { sendAuthRequest } from "../api.js";
import { fetchImageUrl } from "../utils.js";
// Product Viewing
document.addEventListener("DOMContentLoaded", async () => {
    // Fetch and display products on DOM load
    await DisplayProducts();

    //Add event listener for delete buttons
    document.querySelector("tbody").addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-btn")) {
            let productId = e.target.dataset.productId;
            await deleteProduct(productId);
        }
    });
});

async function DisplayProducts() {
    let currentPage = 1; // Default to first page
    let pageSize = 100; // Adjust based on your requirements

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
    let productTableBody = document.querySelector(".product-table tbody");
    productTableBody.innerHTML = ""; // Clear existing rows


    products.forEach(async (product) => {
        let imageUrl = `/products/images/${product.imageName}`;
        let row = document.createElement("tr");
        let objectUrl = await fetchImageUrl(product.imageUrl);
        row.innerHTML = `
            <td><img src="${objectUrl}" alt="Product Image" class="product-image"></td>
            <td>${product.name}</td>
            <td>${product.brand}</td>
            <td>${product.categoryName || "Uncategorized"}</td>
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
                <a href="update_product.html?productId=${product.id}" style="text-decoration: none;">
                    <button class="edit-btn">Edit</button>
                </a>
                <button class="delete-btn" data-product-id="${product.id}">Delete</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}