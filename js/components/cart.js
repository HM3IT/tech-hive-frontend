document.addEventListener('DOMContentLoaded', loadCart);

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('shoppingCart')) || {};
    const cartTable = document.getElementById('cartTable').querySelector('tbody');
    cartTable.innerHTML = '';

    for (const [productId, product] of Object.entries(cart)) {
        const row = `
            <tr>
                <td>${productId}</td>
                <td>${product.price} Ks</td>
                <td>${product.quantity}</td>
                <td>${(product.price * product.quantity).toLocaleString()} Ks</td>
            </tr>`;
        cartTable.innerHTML += row;
    }
}
