import { sendAuthRequest,  } from "../api.js";
import { getCategory, uploadImage, getSubImagUrls } from "../utils.js";


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
    if (!imageUrl && !subImageUrl) {
        alert("Please upload images and sub-images as well!")
        return;
    }

    let imageUrl = await uploadImage(productImage);
  
    let subImageUrl = await getSubImagUrls(subProductImages)
 
    let productData = {
        name: productName,
        description: productDescription,
        price: productPrice,
        imageUrl: imageUrl,
        brand: productBrand,
        categoryId: productCategory,
        stock: productStock,
        discountPercent: productDiscount,
        subImageUrl  
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