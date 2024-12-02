import { sendAuthRequest } from "../api.js";
import { fetchImageUrl, showAlert } from "../utils.js";

document.addEventListener("DOMContentLoaded", async function () {

    const showPolicyBtn = document.getElementById('show-policy-btn');
    const popupForm = document.getElementById('popup-form');
    const closeBtn = document.getElementById('close-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let grandTotal = await getGrandTotal();
    const userName = document.getElementById("user-name");
    const shipAddressInput = document.getElementById("ship-address");
    const phone = document.getElementById("phone");
    const orderSubmitBtn = document.getElementById("order-submit-btn");
    orderSubmitBtn.addEventListener("click", submitOrder);

    const response = await sendAuthRequest("/access/me", "GET");
    if (response.ok) {
        let user = await response.json();
        userName.innerText = user.name;
        shipAddressInput.innerText = user.address || "";
    }

    const grandTotalElement = document.getElementById('order-total');
    grandTotalElement.innerText = `$${grandTotal.toFixed(2)}`;


    await loadCartSummaryTable(cart);



    // Show the popup form when the button is clicked
    showPolicyBtn.addEventListener('click', () => {
        popupForm.classList.remove('hidden');
    });

    // Close the popup form when the close button is clicked
    closeBtn.addEventListener('click', () => {
        popupForm.classList.add('hidden');
    });

    // Close the popup form when clicking outside the content area
    window.addEventListener('click', (event) => {
        if (event.target === popupForm) {
            popupForm.classList.add('hidden');
        }
    });


    async function getGrandTotal() {
        return cart.reduce((total, item) => {
            const discountPercent = item.discountPercentAtOrder || 0;
            const discountAmount = (item.priceAtOrder * discountPercent) / 100;
            const discountedPrice = item.priceAtOrder - discountAmount;
            return total + discountedPrice * item.quantity;
        }, 0);

    }

    async function submitOrder() {

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
        if (!cart || cart.length <= 0) {
            showAlert("Please Add Products!", "#ff4d4d");
            return;
        }
    
        let isValid = true;
        let shipAddress = shipAddressInput.value;
        let phoneNo = phone.value;
        let agreeRefund = document.getElementById("agree-refund-policy").checked;
    
        let shipAddressError = document.getElementById("shipAddress-error");
        let phoneNoError = document.getElementById("phoneNo-error");
        let agreeRefundError = document.getElementById("agreeRefund-error");

        shipAddressError.textContent = "";
        phoneNoError.textContent = "";
        agreeRefundError.textContent = "";
    
        shipAddressError.style.display = "none";
        phoneNoError.style.display = "none";
        agreeRefundError.style.display = "none";
    
        if (!agreeRefund) {
            agreeRefundError.textContent = "*You Must Accept The Terms To Refund Policy.";
            agreeRefundError.style.display = "inline";
            isValid = false;
        }

        if (!shipAddress.trim()) {
            shipAddressError.textContent = "*Shipping Address is required.";
            shipAddressError.style.display = "inline";
            isValid = false;
        }

        if (!phoneNo.trim() || !/^[0-9]+$/.test(phoneNo)) {
            phoneNoError.textContent = "*Phone Number must be required and only contain numbers (0-9).";
            phoneNoError.style.display = "inline";
            isValid = false;
        }
    
        if (!isValid) {
            showAlert("All Fields Are Required!", "#ff4d4d");
            return;
        }

        let orderData = {
            orderProducts: cart,
            address: shipAddress.trim(),
            totalPrice: await getGrandTotal(),
            phone: phoneNo.trim(),
        };
    
        let response = await sendAuthRequest("/orders/add", "POST", orderData);
        if (response.ok) {
            showAlert("Order Is Placed Successfully!", "#28a745");
            let orderData = await response.json();
    
            localStorage.setItem('cart', null);
    
            setTimeout(() => {
                window.location.href = "products.html";
            }, 1000);
          
        } else {
            showAlert("Order Placement Failed. Please try again.", "#ff4d4d");
        }
    }

    async function loadCartSummaryTable(cart) {
        const tblBody = document.getElementById('order-summary-tbody');
        if (!tblBody) {
            return;
        }
        tblBody.innerHTML = '';

        for (const item of cart) {
            const discountPercent = item.discountPercentAtOrder || 0;
            const discountAmount = (item.priceAtOrder * discountPercent) / 100;
            const discountedPrice = item.priceAtOrder - discountAmount;
            const objectUrl = await fetchImageUrl(item.imageUrl);


            const row = document.createElement("tr");
            row.setAttribute("data-index", cart.indexOf(item));
            row.setAttribute("data-id", item.productId);


            row.innerHTML = `
                <td>
                    <img style="width:120px; height: 120px;" src="${objectUrl}" alt="${item.name}" class="cart-product-image" />
                </td>
                <td>${item.name}</td>
                <td>${discountPercent}%</td>
                <td>$${discountedPrice.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td class="grand-total">$${(discountedPrice * item.quantity).toFixed(2)}</td>
            `;


            tblBody.appendChild(row);
        }

    };

});