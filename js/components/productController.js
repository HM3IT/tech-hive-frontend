import { sendAuthRequest,  } from "../api.js";
import { getCategory, uploadImage, getSubImagUrls, showAlert } from "../utils.js";


let dropDownCategory = document.getElementById("product-category");

document.addEventListener("DOMContentLoaded", async () => {
    let categories = await getCategory();

    categories.forEach(category => {
        let optionElement = document.createElement("option");
        optionElement.value = category.id;
        optionElement.text = category.name;
        dropDownCategory.appendChild(optionElement);
    });

    let addProductButton = document.getElementById("submit-btn");
    let cancelButton = document.getElementById("cancel-btn");
    let productForm = document.getElementById("add-product-form");  
 
    if (addProductButton) {
        addProductButton.addEventListener("click", async (e) => {
            e.preventDefault();
            addProduct();
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", async (e) => {
            e.preventDefault();
            productForm.reset()
        });
    }

 
    if (productForm) {
        productForm.addEventListener("submit", async (e) => {
            e.preventDefault();
    
            let productName = document.getElementById("product-name").value;
            if (productName.length > 150) {
                console.log("Product name cannot exceed 150 characters.");
                return;
            }
    
            await addProduct();
        });
    }
});


async function addProduct() {
 
    if (!validateProductForm()) {
        return; 
    }

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

    let subImageUrl = await getSubImagUrls(subProductImages)
    if (imageUrl.length <= 0 && subImageUrl.length <= 0) {
        showAlert("Please upload images and sub-images as well!", "#ff4d4d")
        return;
    }

    let productData = {
        name: productName,
        description: productDescription,
        price: productPrice,
        imageUrl: imageUrl,
        brand: productBrand,
        categoryId: productCategory,
        stock: productStock,
        discountPercent: productDiscount,
        subImageUrl,
    };

    let url = `/products/add`;

    const loadingOverlay = document.getElementById("loadingOverlay")
 
    loadingOverlay.style.display = "flex";

    sendAuthRequest(url, "POST", productData)
        .then((response) => {
            if (response.ok) {
            
                showAlert("Product Added Successfully!", "#28a745");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                console.error("Failed to add product:", response);
                showAlert("Error Adding Product. Please Try Again.", "#ff4d4d");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            showAlert("An Unexpected Error Occurred. Please Try Again.", "#ff4d4d");
        })
        .finally(() => {
  
            loadingOverlay.style.display = "none";
        });
    } 


function validateProductForm() {
    let isValid = true;

    // Input values
    let name = document.getElementById("product-name").value;
    let category = document.getElementById("product-category").value;
    let price = document.getElementById("product-price").value;
    let description = document.getElementById("product-description").value;
    let discount = document.getElementById("product-discount").value;
    let brand = document.getElementById("product-brand").value;
    let stock = document.getElementById("product-stock").value;

    // Error message elements
    let nameError = document.getElementById("name-error");
    let categoryError = document.getElementById("category-error");
    let priceError = document.getElementById("price-error");
    let descriptionError = document.getElementById("description-error");
    let discountError = document.getElementById("discount-error");
    let brandError = document.getElementById("brand-error");
    let stockError = document.getElementById("stock-error");

    // Clear previous error messages
    nameError.textContent = "";
    categoryError.textContent = "";
    priceError.textContent = "";
    descriptionError.textContent = "";
    discountError.textContent = "";
    brandError.textContent = "";
    stockError.textContent = "";

    nameError.style.display = "none";
    categoryError.style.display = "none";
    priceError.style.display = "none";
    descriptionError.style.display = "none";
    discountError.style.display = "none";
    brandError.style.display = "none";
    stockError.style.display = "none";


    // Name validation
    if (name.trim() === "") {
        nameError.textContent = "*Product name is required.";
        nameError.style.display = "inline"
        isValid = false;
    }

    name = name.trim();
    if (name.length > 150) {
        nameError.textContent = "*Product name cannot exceed 150 characters.";
        nameError.style.display = "inline";
        isValid = false;
    }

    // Category validation
    if (category.trim() === "") {
        categoryError.textContent = "*Product category is required.";
        categoryError.style.display = "inline"
        isValid = false;
    }

    // Price validation
    if (price.trim() === "" || isNaN(price) || parseFloat(price) <= 0) {
        priceError.textContent = "*Product price must be a positive number.";
        priceError.style.display = "inline"
        isValid = false;
    }

    // Description validation
    if (description.trim() === "") {
        descriptionError.textContent = "*Product description is required.";
        descriptionError.style.display = "inline"
        isValid = false;
    }

    // Discount validation
    if (discount.trim() === "" || isNaN(discount) || parseFloat(discount) < 0 || parseFloat(discount) > 100) {
        discountError.textContent = "*Discount must be a number between 0 and 100.";
        discountError.style.display = "inline"
        isValid = false;
    }

    // Brand validation
    if (brand.trim() === "") {
        brandError.textContent = "*Product brand is required.";
        brandError.style.display = "inline"
        isValid = false;
    }

    // Stock validation
    if (stock.trim() === "" || isNaN(stock) || parseInt(stock) < 0) {
        stockError.textContent = "*Stock must be a non-negative number.";
        stockError.style.display = "inline"
        isValid = false;
    }

    return isValid;
}
