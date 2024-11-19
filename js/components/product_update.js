import { sendAuthRequest } from "../api.js";
import { fetchImageUrl } from "../utils.js";
import { getCategory } from "../components/productController.js"; // Import getCategory from utils.js

// Get product ID from query parameters
let urlParams = new URLSearchParams(window.location.search);
let productId = urlParams.get("productId");

document.addEventListener("DOMContentLoaded", async () => {
    if (!productId) {
        alert("Product ID is missing!");
        window.location.href = "../admin/products.html"; // Redirect to ../admin/products.html
        return;
    }

    //Assign one default category value to dropdown initially
    let categoryDropdown = document.getElementById("product-category");
    let defaultOption = document.createElement("option");
    defaultOption.value = categoryDropdown;
    defaultOption.selected = true;


    // Populate category dropdown
    await populateCategories();

    // Fetch and display product details
    await fetchProductDetails();

    // Add event listener to the update form
    const updateForm = document.querySelector(".update-product-form");
    updateForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await updateProductDetails();
    });

    // Handle cancel button
    document.querySelector(".cancel-btn").addEventListener("click", () => {
        window.location.href = "../admin/products.html";
    });
});

async function populateCategories() {
    let categories = await getCategory();

    if (categories) {
        categories.forEach((category) => {
            let option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;

        });
    } else {
        console.log("No categories available.");
    }
}

async function fetchProductDetails() {
    let url = `/products/detail/${productId}`; // Removed /api prefix
    let response = await sendAuthRequest(url, "GET", null);

    if (response.ok) {
        let product = await response.json();

        // Populate form fields with existing product data
        document.getElementById("product-name").value = product.name;
        document.getElementById("product-category").value = product.categoryId; // Default category fallback
        document.getElementById("product-brand").value = product.brand || "";
        document.getElementById("product-stock").value = product.stock;
        document.getElementById("product-price").value = product.price;
        document.getElementById("product-discount").value = product.discountPercent || 0;
        document.getElementById("product-description").value = product.description || "";

        // Image Fetching
        let mainImage = document.getElementById("product-image");
        let objectUrl = await fetchImageUrl(product.imageUrl);
        
        if (product.imageUrl) {
            mainImage.src = objectUrl;
        } else {
            showError("Image not available for this product.");
        }
    } else {
        alert("Failed to fetch product details.");
        console.error("Product fetch error:", response);
    }
}

async function updateProductDetails() {
    let name = document.getElementById("product-name").value.trim();
    let categoryId = document.getElementById("product-category").value;
    let brand = document.getElementById("product-brand").value.trim();
    let stock = parseInt(document.getElementById("product-stock").value);
    let price = parseFloat(document.getElementById("product-price").value);
    let discountPercent = parseFloat(document.getElementById("product-discount").value) || 0;
    let description = document.getElementById("product-description").value.trim();

    let productData = {
        name,
        description,
        price,
        brand,
        categoryId,
        stock,
        discountPercent,
        imageUrl: "", // Placeholder for product image URL
        subImageUrl: {}, // Placeholder for sub-images if applicable
    };

    let url = `/products/update/${productId}`;
    let response = await sendAuthRequest(url, "PATCH", JSON.stringify(productData), {
        "Content-Type": "application/json",
    });

    if (response.ok) {
        alert("Product updated successfully!");
        window.location.href = "../admin/products.html"; // Redirect to ../admin/products.html
    } else {
        alert("Failed to update product.");
        console.error("Update error:", response);
    }
}
