function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTableBody = document.querySelector('#cartTable tbody');
    cartTableBody.innerHTML = '';

    cart.forEach((item, index) => {
        // Ensure discountPercent exists and calculate the discounted price
        const discountPercent = item.discountPercent || 0; // Default to 0 if undefined
        const discountAmount = (item.price * discountPercent) / 100;
        const discountedPrice = item.price - discountAmount;

        const row = `
            <tr data-index="${index}">
                <td>
                    <img src="${item.imageUrl}" alt="${item.name}" class="cart-product-image" />
                </td>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
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

function updateCartQuantity(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find((item) => item.id === productId);

    if (product) {
        product.quantity = parseInt(quantity, 10);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function updateGrandTotal(cart) {
    const grandTotal = cart.reduce((sum, item) => {
        const discountPercent = item.discountPercent || 0; // Default to 0 if undefined
        const discountAmount = (item.price * discountPercent) / 100;
        const discountedPrice = item.price - discountAmount;
        return sum + discountedPrice * item.quantity;
    }, 0);
    document.querySelector('.grand-total').innerText = `Grand Total: $${grandTotal.toFixed(2)}`;
}

// Expose functions globally
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;

// Load cart on page load
window.onload = loadCart;
