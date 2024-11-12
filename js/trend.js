
const API_BASE = "http://localhost:8000";
let authToken = null; // Token should be set upon successful login
const itemsPerPage = 2;
let currentPage = 1;
let totalPages = 1;

// Fetch Products with Filters and Display
async function fetchProducts() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const selectedTags = Array.from(document.querySelectorAll('.filter-section input[type="checkbox"]:checked')).map(input => input.value.toLowerCase());
    const selectedPriceRanges = Array.from(document.querySelectorAll('.price-range:checked')).map(input => input.value);

    // Construct query parameters based on filters
    let url = `${API_BASE}/api/products?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    };

    const response = await fetch(url, { headers });

    if (response.ok) {
        const data = await response.json();
        displayProducts(data.items);
        totalPages = Math.ceil(data.total / itemsPerPage);
        updatePaginationControls();
    } else {
        console.error("Failed to fetch products");
    }
}

// Display Products in the Product View Section
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

// Handle Pagination Display
function updatePaginationControls() {
    document.getElementById("prevButton").disabled = currentPage === 1;
    document.getElementById("nextButton").disabled = currentPage === totalPages;
    document.getElementById("pageIndicator").textContent = `Page ${currentPage} of ${totalPages}`;
}

// Change Page for Pagination
function changePage(direction) {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    fetchProducts();
}

// Apply Filters and Fetch Filtered Products
function applyFilters() {
    currentPage = 1; // Reset to the first page for filtered results
    fetchProducts();
}

// Initial Call to Load Products on Page Load
fetchProducts();