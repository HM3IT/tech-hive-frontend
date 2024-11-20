import {fetchImageUrl} from "../utils.js";

let grandTotal = 0.00

function updateCartQuantity(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
 
    const product = cart.find((item) => item.productId === productId);

    if (product) {
        product.quantity = parseInt(quantity, 10);
        localStorage.setItem('cart', JSON.stringify(cart));

    // Update the specific row's total value dynamically
     const row = document.querySelector(`tr[data-id="${productId}"]`);
     if (row) {
         const discountPercent = product.discountPercentAtOrder || 0;
         const discountAmount = (product.priceAtOrder * discountPercent) / 100;
         const discountedPrice = product.priceAtOrder - discountAmount;
         const rowTotal = discountedPrice * product.quantity;
 
         const grandTotalCell = row.querySelector('.grand-total');
         if (grandTotalCell) {
             grandTotalCell.textContent = `$${rowTotal.toFixed(2)}`;
         }
     }
 
     updateGrandTotal(cart);
 }
}
function updateGrandTotal(cart) {
    const grandTotal = cart.reduce((total, item) => {
        const discountPercent = item.discountPercentAtOrder || 0;
        const discountAmount = (item.priceAtOrder * discountPercent) / 100;
        const discountedPrice = item.priceAtOrder - discountAmount;
        return total + discountedPrice * item.quantity;
    }, 0);

    const grandTotalElement = document.getElementById('order-total');
    if (grandTotalElement) {
        grandTotalElement.innerText = `$${grandTotal.toFixed(2)}`;
    }
}

 
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


 function addToCart(productId, productName, productPrice, quantity, discountPercent, imageUrl) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log("IMAGEURL ",imageUrl)
 
    const existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ productId: productId, name: productName, imageUrl, discountPercentAtOrder:discountPercent, priceAtOrder: productPrice, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} has been added to the cart!`);
};

// to be able to call globally
window.updateCartQuantity = updateCartQuantity
window.removeFromCart = removeFromCart
window.addToCart = addToCart

document.addEventListener("DOMContentLoaded", async function(event){
    await loadCart()

})