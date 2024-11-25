import {fetchImageUrl, addToCart, updateCartQuantity, updateGrandTotal, showAlert } from "../utils.js";

async function loadCart() {
    const cartTableBody = document.querySelector('#cartTable tbody');

    if (!cartTableBody){
        return
    }
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
 
    if (!Array.isArray(cart) || cart.length === 0) {
        showAlert("You haven't added any products yet! Please add products", "#ff4d4d");
        setTimeout(() => {
            window.location.href = "products.html";
        }, 1000);
        return;
    }
    
    cartTableBody.innerHTML = '';

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
                <img src="${objectUrl}" alt="${item.name}" class="cart-product-image" />
            </td>
            <td>${item.name}</td>
            <td>$${item.priceAtOrder.toFixed(2)}</td>
            <td>${discountPercent}%</td>
            <td>$${discountedPrice.toFixed(2)}</td>
            <td>
                <input 
                    type="number" 
                    value="${item.quantity}" 
                    min="1" 
                    class="quantity-input" 
                    data-id="${item.productId}" 
                    onchange="updateCartQuantity('${item.productId}', this.value)">
            </td>
            <td class="grand-total">$${(discountedPrice * item.quantity).toFixed(2)}</td>
            <td>
                <button onclick="removeFromCart('${item.productId}')" class="remove-item">Remove</button>
            </td>`;
  
        cartTableBody.appendChild(row);
    }
 
    const cartProductImages = document.getElementsByClassName("cart-product-image");
    for (const image of cartProductImages) {
        image.style.width = "120px";
        image.style.height = "120px";
    }

    updateGrandTotal(cart);
}


async function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter((item) => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    await loadCart();
}


// to be able to call globally
window.addToCart = addToCart
window.updateCartQuantity = updateCartQuantity
window.removeFromCart = removeFromCart

document.addEventListener("DOMContentLoaded", async function(event){
    await loadCart()

})


async function confirmRemove(productId) {
    showConfirmBox(
        "Do You Want to Remove this Item?",
        async () => {
            await removeFromCart(productId); // Call the existing removeFromCart function
        },
        () => {
            console.log("Remove action cancelled."); // Optional: Handle cancel case
        }
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const cartContainers = document.querySelectorAll('.cart-container');
    const grandTotalElement = document.querySelector('.grand-total');

    cartContainers.forEach(cart => {
        const decrementBtn = cart.querySelector('.decrement');
        const incrementBtn = cart.querySelector('.increment');
        const quantityInput = cart.querySelector('.quantity-input');
        const removeBtn = cart.querySelector('.remove-btn');

        decrementBtn.addEventListener('click', () => {
            if (quantityInput.value > 1) {
                quantityInput.value--;
                updateTotal();
            }
        });

        incrementBtn.addEventListener('click', () => {
            quantityInput.value++;
            updateTotal();
        });

        removeBtn.addEventListener('click', () => {
            cart.remove();
            updateTotal();
        });
    });

    function updateTotal() {
        let total = 0;
        cartContainers.forEach(cart => {
            const price = parseFloat(cart.querySelector('.product-info p').textContent.replace('$', ''));
            const quantity = parseInt(cart.querySelector('.quantity-input').value, 10);
            total += price * quantity;
        });
        grandTotalElement.textContent = `Total: $${total.toFixed(2)}`;
    }
});
