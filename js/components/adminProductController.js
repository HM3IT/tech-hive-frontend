import { fetchImageUrl, getProducts, createPagination } from "../utils.js";
 
let searchQry= "null"

const page = 1;
const limit = 8;
document.addEventListener("DOMContentLoaded", async () => {

    let data = await getProducts(page, limit, searchQry)
    const searchBtn = document.getElementById("search-btn")
    let searchInputBox = document.getElementById("search-input");
    searchBtn.addEventListener("click", searchProduct);
    searchInputBox.addEventListener("keypress", async function(event) {
        if (event.key === "Enter") {
            await searchProduct()
        }
    });

    createPagination(data.total, data.perPage, getProducts, displayProductTbl, searchQry);

});

async function searchProduct(){
    let searchVal =  document.getElementById("search-input").value;
    searchVal = searchVal.trim()

    if(searchVal.length > 0){
        searchQry = searchVal;
        let data = await getProducts(page, limit, searchQry);
        createPagination(data.total, data.perPage, getProducts, displayProductTbl, searchQry);
    }
}



async function displayProductTbl(products) {
    const tblBody = document.getElementById("product-tbl-body")
  
    tblBody.innerHTML = ""; 

    products.forEach(async (product) => {
        let row = document.createElement("tr");
        let objectUrl = await fetchImageUrl(product.imageUrl);
        row.innerHTML = `
            <td><img src="${objectUrl}" alt="Product Image" class="product-image"></td>
            <td>${product.name}</td>
            <td>${product.brand}</td>
            <td>${product.categoryName}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <span class="status ${product.stock > 0 ? "available" : "unavailable"}">
                ${product.stock > 0 ? product.stock : "Out of Stock"}
                </span>
            </td>
            <td>
                <a href="productDetail.html?productId=${product.id}" style="text-decoration: none;">
                    <button class="view-btn">View</button>
                </a>
                <a href="updateProduct.html?productId=${product.id}" style="text-decoration: none;">
                    <button class="edit-btn">Edit</button>
                </a>
                <button class="delete-btn" data-product-id="${product.id}">Delete</button>
            </td>
        `;
        tblBody.appendChild(row);
    });
    tblBody.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-btn")) {
            let productId = e.target.dataset.productId;
            await deleteProduct(productId);
        }
    });
}

