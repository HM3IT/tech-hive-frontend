import { getProducts } from '../api.js';
import { fetchImageUrl } from '../utils.js';

async function displayProducts(products) {
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
                <a href="carts.html">Add to cart</a>
                <button class="read-more">Read More</button>           
            </div>`;

        productView.innerHTML += productCard;
    }
}

function createPagination(totalItems, itemsPerPage, fetchFunction, displayFunction) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.getElementById('paginationControls');
    paginationContainer.innerHTML = '';

    let currentPage = 1;

    function renderPage(page) {
        currentPage = page;
        fetchFunction(page, itemsPerPage).then(data => {
            displayFunction(data.items);
        });

        // Update active page styles
        const pageLinks = paginationContainer.querySelectorAll('a');
        pageLinks.forEach(link => {
            link.classList.remove('active');
            if (parseInt(link.textContent) === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // Create previous button
    const prevButton = document.createElement('a');
    prevButton.innerHTML = '&laquo;';
    prevButton.href = '#';
    prevButton.onclick = (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            renderPage(currentPage - 1);
        }
    };
    paginationContainer.appendChild(prevButton);

    // Create page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.textContent = i;
        pageLink.href = '#';
        pageLink.className = i === currentPage ? 'active' : '';
        pageLink.onclick = (e) => {
            e.preventDefault();
            renderPage(i);
        };
        paginationContainer.appendChild(pageLink);
    }

    // Create next button
    const nextButton = document.createElement('a');
    nextButton.innerHTML = '&raquo;';
    nextButton.href = '#';
    nextButton.onclick = (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            renderPage(currentPage + 1);
        }
    };
    paginationContainer.appendChild(nextButton);

    // Initial render
    renderPage(currentPage);
}

document.addEventListener("DOMContentLoaded", loadProduct);

async function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const limit = 10;
    let filterType = urlParams.get('filter_type');

    if (filterType) {
        filterType = filterType.replaceAll("'", "");
    }

    const products = await getProducts(1, limit, filterType);
    const items = products.items;

    displayProducts(items);
    createPagination(products.total, limit, getProducts, displayProducts);
}
