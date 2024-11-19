import { sendRequest } from '../api.js';
import { fetchImageUrl } from '../utils.js';



async function displayProducts(products) {
    const productView = document.getElementById("productView");
    productView.innerHTML = '';

    for (const product of products) {
        let objectUrl = await fetchImageUrl(product.imageUrl);
        const productCard = `
            <div class="product-card" data-id="${product.id}" data-price="${product.price}" data-discount="${product.discountPercent}">
                <img src="${objectUrl}" alt="${product.name}" class="product-image">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-tags">
                    ${product.discountPercent > 0 ? '<span class="tag">Discount</span>' : ''}
                </div>
                <p class="product-price">Price: $${product.price}</p>
                <p class="product-discount">Discount: ${product.discountPercent}%</p>                  
                <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, 1, ${product.discountPercent})" class="add-to-cart">Add to Cart</button>
            </div>`;
        
        productView.innerHTML += productCard;
    }
}

window.addToCart = function(productId, productName, productPrice, quantity, discountPercent) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product already exists in the cart
    const existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ id: productId, name: productName,discountPercent, price: productPrice, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} has been added to the cart!`);
};

export { displayProducts };



function createPagination(totalItems, itemsPerPage, fetchFunction, displayFunction, filters) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.getElementById('paginationControls');
    paginationContainer.innerHTML = '';

    let currentPage = 1;

    function renderPage(page) {
        currentPage = page;
        fetchFunction(page, itemsPerPage, filters).then(data => {
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

async function getProducts(page, limit, filters){
    let response = await sendRequest(`/products/search?query_str=${filters}&page=${page}&limit=${limit}`, "GET");
    if(response.ok){
      let data = await response.json();
      let products = data.items;
      let unwrappedProducts = products.map(item => item.document);
      console.log("inside")
      console.log(data)
      return {
        total: data.total, 
        items: unwrappedProducts,
        perPage: data.per_page
      };
    }
    return {}
    
}
// ============================
// Search and Filter section
// ===========================
async function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const limit = 10;
    const page= 1
    let filterType = urlParams.get('filter_type');
    let filters = null
    if (filterType) {
        filters = filterType.replaceAll("'", ""); 
    }
    let data = await getProducts(limit, page, filters);
    console.log(data)
    createPagination(data.total, limit, getProducts, displayProducts, filters);
    } 
    
 

let oldSearchVal =""
const handleSearchInput = debounce(async(event) => {
  let searchVal = event.target.value;
  // search optimization
  let limit = 10
  console.log("Listening")
  if (oldSearchVal === searchVal){
    return
  }
  oldSearchVal = searchVal
  searchVal = searchVal.trim().toLowerCase(); 
  let filters = encodeURIComponent(searchVal);
  let data = await getProducts(1, limit, filters)
  createPagination(data.total, limit, getProducts, displayProducts, filters);
}, 500);


const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", handleSearchInput);

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

document.addEventListener("DOMContentLoaded", async function(e){
    loadProduct();
    const priceRangeRadios = document.getElementsByClassName("price-range");

    for (let i = 0; i < priceRangeRadios.length; i++) {
        priceRangeRadios[i].addEventListener("change", handlePriceRangeChange);
    }
    
    async function handlePriceRangeChange() {
    
        const selectedValue = Array.from(priceRangeRadios)
            .find(radio => radio.checked)?.value;
        let limit= 10
        let filters = `null&price_range=${selectedValue}`
        let data = await getProducts(1, limit, filters)
        createPagination(data.total, limit, getProducts, displayProducts, filters);

    }
});

