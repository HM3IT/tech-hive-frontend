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

    let addProductButton = document.getElementById("submit-btn");
    let cancelButton = document.getElementById("cancel-btn");
    let productForm = document.getElementById("add-product-form"); // Get the form element

    // Attach event listeners to buttons
    if (addProductButton) {
        addProductButton.addEventListener("click", async (e) => {
            e.preventDefault();
            addProduct();
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", async (e) => {
            e.preventDefault();
            handleCancelForm();
        });
    }

    // Attach event listener to the form submission
    if (productForm) {
        productForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Prevent the default form submission behavior
            await addProduct(); // Call addProduct function
        });
    }
});


async function addProduct() {

 // Show the initial confirmation dialog for adding a product
    showInfoBox(
        "Are You Sure You Want to Add the New Product?",
        async () => {
            // If "OK" is clicked, perform form validation and add the product
            if (!validateProductForm()) {
                return; // Exit if validation fails
            }

            // Gather form data
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
                alert("Please upload images and sub-images as well!")
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

            try {
                let response = await sendAuthRequest(url, "POST", productData);

                if (response.ok) {
                    // Show the success message and redirect
                    displayMessage("Product added successfully!", "success");
                    setTimeout(() => {
                        window.location.href = "../admin/products.html";
                    }, 1000);
                } else {
                    console.error("Failed to add product:", response);
                    displayMessage("Error adding product. Please try again.", "error");
                }
            } catch (error) {
                console.error("Error:", error);
                displayMessage("An unexpected error occurred. Please try again.", "error");
            }
        },
        // If "Cancel" is clicked, show the second confirmation dialog
        () => {
            showInfoBox(
                "Are You Sure You Want to Cancel the Adding of the New Product?",
                () => {
                    // On confirmation of cancellation, redirect to products.html
                    displayMessage("Action canceled successfully.", "success");
                    setTimeout(() => {
                        window.location.href = "../admin/products.html";
                    }, 1000);
                },
                // On canceling the second dialog, do nothing
                () => {}
            );
        }
    );
}

function handleCancelForm() {
    // Redirect to products.html directly
    window.location.href = "../admin/products.html";
}

// Show a reusable confirmation dialog
function showInfoBox(message, onOk, onCancel) {
    // Create the info box container
    let infoBox = document.createElement("div");
    infoBox.classList.add("info-box");

    infoBox.innerHTML = `
        <div class="info-content">
            <p>${message}</p>
            <div class="info-buttons">
                <button id="info-ok" class="info-btn info-ok">OK</button>
                <button id="info-cancel" class="info-btn info-cancel">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(infoBox);

    // Event listeners for OK and Cancel
    document.getElementById("info-ok").addEventListener("click", async () => {
        infoBox.remove();
        if (onOk) onOk();
    });

    document.getElementById("info-cancel").addEventListener("click", async () => {
        infoBox.remove();
        if (onCancel) onCancel();
    });
}


function validateProductForm() {
    let isValid = true;

    // Input values
    let name = document.getElementById("product-name").value;
    let category = document.getElementById("product-category").value;
    let price = document.getElementById("product-price").value;
    // let image = document.getElementById("product-image").files.length;
    // let subImages = document.getElementById("sub-product-image").files.length;
    let description = document.getElementById("product-description").value;
    let discount = document.getElementById("product-discount").value;
    let brand = document.getElementById("product-brand").value;
    let stock = document.getElementById("product-stock").value;

    // Error message elements
    let nameError = document.getElementById("name-error");
    let categoryError = document.getElementById("category-error");
    let priceError = document.getElementById("price-error");
    // let imageError = document.getElementById("image-error");
    // let subImageError = document.getElementById("subimage-error");
    let descriptionError = document.getElementById("description-error");
    let discountError = document.getElementById("discount-error");
    let brandError = document.getElementById("brand-error");
    let stockError = document.getElementById("stock-error");

    // Clear previous error messages
    nameError.textContent = "";
    categoryError.textContent = "";
    priceError.textContent = "";
    // imageError.textContent = "";
    // subImageError.textContent = "";
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

    // // Image validation
    // if (image === 0) {
    //     imageError.textContent = "Product image is required.";
    //     imageError.style.display = "inline"
    //     isValid = false;
    // }

    // // Sub-image validation
    // if (subImages === 0) {
    //     subImageError.textContent = "At least one sub-image is required.";
    //     subImageError.style.display = "inline"
    //     isValid = false;
    // }

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

function displayMessage(message, type) {
    let messageContainer = document.createElement("div");
    messageContainer.classList.add(
        "message-container",
        type === "success" ? "success-message" : "error-message"
    );

    messageContainer.innerHTML = `
        <div class="message-content">
            <h2>${type === "success" ? "Success" : "Error"}</h2>
            <p>${message}</p>
        </div>
    `;

    document.body.appendChild(messageContainer);

    // Automatically remove the message and handle redirection if success
    setTimeout(() => {
        messageContainer.remove();
        if (type === "success") {
            window.location.href = "../admin/products.html"; // Redirect on success
        }
    }, 3000);
}