import { displayProducts, createPagination, getProducts } from '../utils.js';

let price_range_filter = "null"
let category_filter = "null"
let query_filter = "null"


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
        price_range_filter = `null&price_range=${selectedValue}`
        let data = await getProducts(1, limit, price_range_filter)
        createPagination(data.total, limit, getProducts, displayProducts, price_range_filter);

    }
});



// add to cart handler
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