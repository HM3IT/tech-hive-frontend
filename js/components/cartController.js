import {fetchImageUrl, addToCart, updateCartQuantity, updateGrandTotal } from "../utils.js";

async function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTableBody = document.querySelector('#cartTable tbody');
    if (!cartTableBody) {
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