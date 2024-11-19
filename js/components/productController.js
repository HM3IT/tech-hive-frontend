import { sendAuthRequest, sentformRequest } from "../api.js";
import { getCategory } from "../utils.js";


let dropDownCategory = document.getElementById("product-category");

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Hello");
    let categories = await getCategory();

    categories.forEach(category => {
        let optionElement = document.createElement("option");
        optionElement.value = category.id;
        optionElement.text = category.name;
        dropDownCategory.appendChild(optionElement);
    });

    let productForm = document.getElementById("add-product-form")
    if (productForm) {
    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await addProduct();
    });}
});

export async function getCategory() {
    let currentPage = 1;
    let pageSize = 300;

    let url = `/categories/list?currentPage=${currentPage}&pageSize=${pageSize}`;

    let response = await sendAuthRequest(url, "GET", null);

    if (response.ok) {
        let data = await response.json();
        return data.items;
    } else {
        console.log("Failed to fetch categories:", response);
    }
}

 
async function uploadImage(file) {
    let formData = new FormData();
    formData.append("file", file);

    let url = `/files/upload`;
    try {
    
        let result = await sentformRequest(url, "POST", formData);

       
        return result.file_path; 
        
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
    let productImage = document.getElementById("product-image").files[0];
    let productBrand = document.getElementById("product-brand").value;
    let productStock = parseInt(document.getElementById("product-stock").value) || 0;
    let productDiscount = parseInt(document.getElementById("product-discount").value) || 0;
    let subProductImages = document.getElementById("sub-product-image").files;

    let imageUrl = await uploadImage(productImage);
    if (!imageUrl) return;


    let subImageUrls = await Promise.all(
        Array.from(subProductImages).map(async (file) => {
            return await uploadImage(file); // uploadImage returns the file path
        })
    );
    
  
    let subImgUrlObj = {};
    subImageUrls.forEach((url, index) => {
        const key = index === 0 ? 'first' : index === 1 ? 'second' : `image${index + 1}`;
        subImgUrlObj[key] = url;
    });
 
    let productData = {
        name: productName,
        description: productDescription,
        price: productPrice,
        imageUrl: imageUrl,
        brand: productBrand,
        categoryId: productCategory,
        stock: productStock,
        discountPercent: productDiscount,
        subImageUrl: subImgUrlObj  
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