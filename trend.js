import {getProducts} from './js/api.js'

// window.onload = function() {
    // const currentURL = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
 
    const productsPerPage = 10;
 
    const filter_type = urlParams.get('filter_type').replaceAll("'","");  
    
    // urlParams.forEach((value, key) => {
    //     console.log(`Parameter: ${key}, Value: ${value}`);

    // });    let currentPage = 1;



    function displayProducts(page) {
        const filteredProducts = applyFilters();
        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const displayedProducts = filteredProducts.slice(startIndex, endIndex);

        const productView = document.getElementById('productView');
        productView.innerHTML = '';  

        displayedProducts.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product-card';
            productDiv.innerHTML = `<h3>${product.name}</h3><p>Price: $${product.price}</p>`;
            productView.appendChild(productDiv);
        });
    }



    function displayProducts(products) {
        const productView = document.getElementById("productView");
        productView.innerHTML = ''; // Clear existing products
    
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
// };


function createPagination(totalProducts) {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = ''; // Clear existing pagination

    const prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.innerHTML = '&laquo;';
    prevLink.onclick = (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            displayProducts(currentPage);
            createPagination(totalProducts);
        }
    };
    paginationControls.appendChild(prevLink);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.innerText = i;
        pageLink.className = currentPage === i ? 'active' : '';
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            displayProducts(currentPage);
            createPagination(totalProducts);
        });
        paginationControls.appendChild(pageLink);
    }

    const nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.innerHTML = '&raquo;';
    nextLink.onclick = (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts(currentPage);
            createPagination(totalProducts);
        }
    };
    paginationControls.appendChild(nextLink);
}

function applyFilters() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const selectedTags = Array.from(document.querySelectorAll('.tag-filter:checked')).map(checkbox => checkbox.value);
    const selectedPriceRanges = Array.from(document.querySelectorAll('.price-range:checked')).map(checkbox => checkbox.value);

    return products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchValue);
        const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => product.tags.includes(tag));
        const matchesPrice = selectedPriceRanges.length === 0 || selectedPriceRanges.some(range => {
            const [min, max] = range.split('-').map(Number);
            return max ? product.price >= min && product.price <= max : product.price >= min;
        });
        return matchesSearch && matchesTags && matchesPrice;
    });
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
displayProducts(currentPage);
createPagination(applyFilters().length);