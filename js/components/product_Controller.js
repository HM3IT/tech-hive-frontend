import { sendAuthRequest } from "../api.js";
import { sentformRequest } from "../api.js";


let dropDownCategory = document.getElementById("product-category");

document.addEventListener("DOMContentLoaded", async () => {
    // Fetch categories on DOM load
    let categories = await getCategory();
    console.log(categories);

    categories.forEach(category => {
        let optionElement = document.createElement("option");
        optionElement.value = category.id;
        optionElement.text = category.name;
        dropDownCategory.appendChild(optionElement);
    });

    // Call addProduct when the submit button is clicked
    document.getElementById("submit-btn").addEventListener("click", async (e) => {
        e.preventDefault();
        await addProduct();
    });
});

async function getCategory() {
    let currentPage = 1;
    let pageSize = 300;

    let url = `/categories?currentPage=${currentPage}&pageSize=${pageSize}`;

    let response = await sendAuthRequest(url, "GET", null);

    if (response.ok) {
        let data = await response.json();
        return data.items;
    } else {
        console.log("Failed to fetch categories:", response);
    }
}

// Adding Product
async function uploadImage(file) {
    let formData = new FormData();
    formData.append("data", file);

    let url = `/files/upload`; // Endpoint for file upload
    try {
        // Use sendAuthRequest with FormData
        let response = await sentformRequest(url, "POST", formData);

        if (response.ok) {
            let result = await response.json();
            return result.file_path; // Adjust based on API response
        } else {
            console.error("Image upload failed:", response);
            alert("Error uploading image. Please try again.");
            return null;
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        alert("An unexpected error occurred during image upload.");
        return null;
    }
}

async function addProduct() {
    let productName = document.getElementById("product-name").value;
    let productDescription = document.getElementById("product-description").value;
    let productPrice = parseFloat(document.getElementById("product-price").value);
    let productCategory = document.getElementById("product-category").value;
    let productImage = document.getElementById("product-image").files[0]; // Use the file itself
    let productBrand = document.getElementById("product-brand").value;
    let productStock = parseInt(document.getElementById("product-stock").value) || 0;
    let productDiscount = parseInt(document.getElementById("product-discount").value) || 0;
    let subProductImages = document.getElementById("sub-product-image").files;

    // Step 1: Upload main product image
    console.log(productImage)
    //let imageUrl = await uploadImage(productImage);
    //if (!imageUrl) return; // Stop if image upload fails

    // Step 2: Upload sub-images concurrently and get their URLs
    // let subImageUrls = await Promise.all(
    //     Array.from(subProductImages).map(async (file) => {
    //         return await uploadImage(file);
    //     })
    // );
    let imageUrl = "text";
    let subImageUrls = {
        first: "a",
    }; 

    let productData = {
        name: productName,
        description: productDescription,
        price: productPrice,
        imageUrl: imageUrl,
        brand: productBrand,
        categoryId: productCategory,
        stock: productStock,
        discountPercent: productDiscount,
        subImageUrl: subImageUrls // Filter out failed uploads
    };

    let url = `/products/add`;

    try {
        let response = await sendAuthRequest(url, "POST", productData);

        if (response.ok) {
            let result = await response.json();
            alert("Product added successfully!");
            document.querySelector(".add-product-form").reset();
            console.log(result);
        } else {
            console.error("Failed to add product:", response);
            alert("Error adding product. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An unexpected error occurred. Please try again.");
    }
}