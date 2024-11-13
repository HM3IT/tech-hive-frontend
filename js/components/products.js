import {getProducts} from '../api.js'
import { createPagination } from '../utils.js';
 
async function displayProducts(products) {
    const productView = document.getElementById("productView");
    productView.innerHTML = '';

    products.forEach(product => {
        const productCard = `
            <div class="product-card" data-price="${product.price}" data-discount="${product.discountPercent}">
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
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
    });
}

async function loadProduct() {
    let urlParams = new URLSearchParams(window.location.search);
    let limit = 10;
    let currentPage = 1;
    let filter_type = urlParams.get('filter_type').replaceAll("'","");  
    let products = await getProducts(filter_type, limit, currentPage);

    console.log("Started")
    let items = products.items;
    console.log(items)
    displayProducts(items);
    createPagination(products.total, currentPage, limit,displayProducts )
}

loadProduct()

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


function updatePaginationControls() {
    document.getElementById("prevButton").disabled = currentPage === 1;
    document.getElementById("nextButton").disabled = currentPage === totalPages;
    document.getElementById("pageIndicator").textContent = `Page ${currentPage} of ${totalPages}`;
}
 
function changePage(direction) {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    fetchProducts();
}

 
function applyFilters() {
    currentPage = 1;  
    fetchProducts();
}

document.getElementById('searchInput').addEventListener('input', () => {
    currentPage = 1;
    displayProducts(currentPage);
    createPagination(applyFilters().length);
});

document.querySelectorAll('.tag-filter').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        currentPage = 1;
        displayProducts(currentPage);
        createPagination(applyFilters().length);
    });
});

document.querySelectorAll('.price-range').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        currentPage = 1;
        displayProducts(currentPage);
        createPagination(applyFilters().length);
    });
});

// Initialize display and pagination on page load
