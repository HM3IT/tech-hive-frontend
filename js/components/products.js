import { displayProducts, createPagination, getProducts, showAlert, getTags } from '../utils.js';

let price_range_filter = "null"
let query_filter = "null"
let selectedTags = new Set();
// ============================
// Search and Filter section
// ===========================
async function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const limit = 10;
    const page= 1
    let filterType = urlParams.get('filter_type');
    let searchVal = urlParams.get('search');
  
    if (filterType) {
        query_filter = filterType.replaceAll("'", ""); 
    }
    if (searchVal){
      searchVal = searchVal.toLocaleLowerCase()
      query_filter = `${searchVal}`
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

async function handleTagSelection(event) {
  const tag = event.target.value;

  if (event.target.checked) {
      selectedTags.add(tag);
  } else {
      selectedTags.delete(tag);
  }

  let filteredTagQry = Array.from(selectedTags).join(", ");
  let filters = `${filteredTagQry}&price_range=${price_range_filter}` 
  let data = await getProducts(1, 10, filters)
  let total = data.total
  if(total <= 0){
    showAlert("No products are found", "#ff4d4d")
  }else{
      createPagination(1, 10, getProducts, displayProducts, filters);
  }
}

function createTagFilter(tagNames){
  let tagContainer =  document.getElementById("tag-filters")
  tagNames.forEach(tag => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "tag-filter";
    checkbox.value = tag;
    
    const label = document.createElement("label");
    label.textContent = tag;
    label.prepend(checkbox);

    const wrapper = document.createElement("div");
    wrapper.appendChild(label);

    tagContainer.appendChild(wrapper);
 
    checkbox.addEventListener("change", handleTagSelection);
});
  
}

document.addEventListener("DOMContentLoaded", async function(e){
    loadProduct();
    let tags = await getTags();
    let tagNames = tags.map((tag)=>(tag.name))

    createTagFilter(tagNames)
   
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

