import { sendAuthRequest } from "../api.js";
import { fetchImageUrl } from "../utils.js";

// import { getCategory } from "./productController.js";

document.addEventListener("DOMContentLoaded", async () => {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("productId");

        if (!productId) {
            showError("Invalid Product ID. Please check the URL.");
            return;
        }

        const url = `/products/detail/${productId}`; // API URL for the product detail
        let product = await fetchProductDetails(url);
        
        let productName = document.getElementById("product-name");
        // let categorySpan = document.getElementById("category");
        let brandSpan = document.getElementById("brand");
        let originalPrice = document.getElementById("original-price");
        let discountedPrice = document.getElementById("discounted-price");
        let discount = document.getElementById("discount");
        let availability = document.getElementById("availability");
        let descriptionSpan = document.getElementById("description");
        let userRating = document.getElementById("userRating");
        
        // Update the content of the elements
        productName.innerText = product.name;
        // categorySpan.innerText = categoryName;
        brandSpan.innerText = product.brand;
        originalPrice.innerText = `${product.price} Ks`;
        let discountedPriceValue = product.price - (product.price * product.discountPercent) / 100;
        discountedPrice.innerText = `${discountedPriceValue.toFixed(2)} Ks`;
        discount.innerText = `Discount: ${product.discountPercent}% OFF`;
        availability.innerText = `Available Quantity - ${product.stock}`;
        descriptionSpan.innerText = product.description;
        userRating.innerText = `Current Rating: ${product.rating || "No ratings yet"} stars`;

        // Image Fetching
        let mainImage = document.getElementById("mainImage");
        let objectUrl = await fetchImageUrl(product.imageUrl);
        
        if (product.imageUrl) {
            mainImage.src = objectUrl;
        } else {
            showError("Image not available for this product.");
        }

        //Sub Image Fetching
        // let mainImage = document.getElementById("subImage");
        // let objectUrl = await fetchImageUrl(product.imageUrl);
        
        // if (product.imageUrl) {
        //     mainImage.src = objectUrl;
        // } else {
        //     showError("Image not available for this product.");
        // }

});


// Fetch product details from the API and update DOM directly
async function fetchProductDetails(url) {
        const response = await sendAuthRequest(url); // Use sendAuthRequest for API call
                console.log(response);
                if (response.ok){
                    let product = await response.json()
                    return product
                }
}

// Show error message in the product details section
function showError(message) {
    const container = document.getElementById("product-details");
    container.innerHTML = `<p class="error">${message}</p>`;
}

// Function to handle rating
function rateProduct(rating) {
    document.getElementById("userRating").textContent = `You rated this product ${rating} star(s)`;
}
  