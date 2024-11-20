import { sendAuthRequest } from "../api.js";

let grandTotal = 0.00

function updateCartQuantity(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find((item) => item.id === productId);

    if (product) {
        product.quantity = parseInt(quantity, 10);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

const loadCart= function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTableBody = document.querySelector('#cartTable tbody');
    if (!cartTableBody){
        return
    }
    cartTableBody.innerHTML = '';

    cart.forEach((item, index) => {
        // Ensure discountPercent exists and calculate the discounted price
        const discountPercent = item.discountPercentAtOrder || 0;
        const discountAmount = (item.priceAtOrder * discountPercent) / 100;
        const discountedPrice = item.priceAtOrder - discountAmount;

        const row = `
            <tr data-index="${index}">
                <td>
                    <img src="${item.imageUrl}" alt="${item.name}" class="cart-product-image" />
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
                        data-id="${item.id}" 
                        onchange="updateCartQuantity('${item.id}', this.value)">
                </td>
                <td>$${(discountedPrice * item.quantity).toFixed(2)}</td>
                <td>
                    <button onclick="removeFromCart('${item.id}')" class="remove-item">Remove</button>
                </td>
            </tr>`;
        cartTableBody.innerHTML += row;
    });

    updateGrandTotal(cart);
}


function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function updateGrandTotal(cart) {
    grandTotal = cart.reduce((sum, item) => {
        const discountPercent = item.discountPercentAtOrder || 0;
        const discountAmount = (item.priceAtOrder * discountPercent) / 100;
        const discountedPrice = item.priceAtOrder - discountAmount;
        return sum + discountedPrice * item.quantity;
    }, 0);
    document.querySelector('.grand-total').innerText = `Grand Total: $${grandTotal.toFixed(2)}`;
}


async function submitOrder(){
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
 
    if (!cart || cart.length <= 0){
        alert("Please add products")
        return
    }

    let orderData = {
        orderProducts: cart,
        address: "sample address",
        totalPrice: grandTotal,
    };
 
    let response = await sendAuthRequest("/orders/add","POST", orderData)
    if (response.ok){
        alert("Order is placed successfully")
        let orderData = await response.json();

        // deleting old cart data
        localStorage.setItem('cart', null)
        window.location.reload();

        console.log(orderData)
    }
}

 
function addToCart(productId, productName, productPrice, quantity, discountPercent) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
 
    const existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ productId: productId, name: productName, discountPercentAtOrder:discountPercent, priceAtOrder: productPrice, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} has been added to the cart!`);
};

// to be able to call globally
window.updateCartQuantity = updateCartQuantity
window.removeFromCart = removeFromCart
window.addToCart = addToCart

document.addEventListener("DOMContentLoaded", async function(event){
    loadCart()

    let orderSubmitBtn = document.getElementById("order-submit-btn");
    if (orderSubmitBtn){

        orderSubmitBtn.addEventListener("click", submitOrder)
    }
})