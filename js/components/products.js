import { displayProducts, createPagination, getProducts, showAlert } from '../utils.js';

let price_range_filter = "null"
let query_filter = "null"

// ============================
// Search and Filter section
// ===========================
async function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const limit = 10;
    const page= 1
    let filterType = urlParams.get('filter_type');
  
    if (filterType) {
        query_filter = filterType.replaceAll("'", ""); 
    }
    let filters = `${query_filter}&price_range=${price_range_filter}`
    let data = await getProducts(limit, page, filters);
    let total = data.total;
    if(total <= 0){
        showAlert("No products are found", "#ff4d4d")
      }else{
    createPagination(total, limit, getProducts, displayProducts, filters);
      }
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
  query_filter = encodeURIComponent(searchVal);
  let filters = `${query_filter}&price_range=${price_range_filter}` 
  let data = await getProducts(1, limit, filters)
  let total = data.total
  if(total <= 0){
    showAlert("No products are found", "#ff4d4d")
  }else{
      createPagination(total, limit, getProducts, displayProducts, filters);
  }
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
        let filters = `${query_filter}&price_range=${price_range_filter}`
        let data = await getProducts(1, limit, filters)
        let total = data.total
        if(total <= 0){
            showAlert("No products are found", "#ff4d4d")
          }else{
        createPagination(total, limit, getProducts, displayProducts, filters);
        }
    }
});
