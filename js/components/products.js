import {getProducts} from '../api.js'
import { createPagination, fetchImageUrl } from '../utils.js';
 
async function displayProducts(products) {
    console.log(
        `Product ${products}`
    )
    const productView = document.getElementById("productView");
    productView.innerHTML = '';

    for (const product of products) {
       
        let objectUrl = await fetchImageUrl(product.imageUrl);

        const productCard = `
            <div class="product-card" data-price="${product.price}" data-discount="${product.discountPercent}">
                <img src="${objectUrl}" alt="${product.name}" class="product-image">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-tags">
                    ${product.discountPercent > 0 ? '<span class="tag">Discount</span>' : ''}
                </div>
                <p class="product-price">Price: $${product.price}</p>
                <p class="product-discount">Discount: ${product.discountPercent}%</p>
                <button class="read-more">Read More</button>
            </div>`;

        productView.innerHTML += productCard;
    }
}

document.addEventListener("DOMContentLoaded", loadProduct)

async function loadProduct() {
    let urlParams = new URLSearchParams(window.location.search);
    let limit = 10;
    let filter_type = urlParams.get('filter_type')
    if (filter_type){
        filter_type = filter_type.replaceAll("'","");  
    }
    let products = await getProducts(1, limit, filter_type);

    console.log("Started")
    let items = products.items;
    console.log(items)
    displayProducts(items);
    createPagination(products.total, limit, getProducts, displayProducts )
}


// function applyFilters() {
//     const searchValue = document.getElementById('searchInput').value.toLowerCase();
//     const selectedTags = Array.from(document.querySelectorAll('.tag-filter:checked')).map(checkbox => checkbox.value);
//     const selectedPriceRanges = Array.from(document.querySelectorAll('.price-range:checked')).map(checkbox => checkbox.value);

//     return products.filter(product => {
//         const matchesSearch = product.name.toLowerCase().includes(searchValue);
//         const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => product.tags.includes(tag));
//         const matchesPrice = selectedPriceRanges.length === 0 || selectedPriceRanges.some(range => {
//             const [min, max] = range.split('-').map(Number);
//             return max ? product.price >= min && product.price <= max : product.price >= min;
//         });
//         return matchesSearch && matchesTags && matchesPrice;
//     });
// }



// document.getElementById('searchInput').addEventListener('input', () => {
//     currentPage = 1;
//     displayProducts(currentPage);
//     createPagination(applyFilters().length);
// });

// document.querySelectorAll('.tag-filter').forEach(checkbox => {
//     checkbox.addEventListener('change', () => {
//         currentPage = 1;
//         displayProducts(currentPage);
//         createPagination(applyFilters().length);
//     });
// });

// document.querySelectorAll('.price-range').forEach(checkbox => {
//     checkbox.addEventListener('change', () => {
//         currentPage = 1;
//         displayProducts(currentPage);
//         createPagination(applyFilters().length);
//     });
// });

// Initialize display and pagination on page load
