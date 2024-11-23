import { fetchImageUrl, getProducts, createPagination } from "../utils.js";
 
document.addEventListener("DOMContentLoaded", async () => {

    const page = 1;
    const limit = 8;

    let filters = "null"
    
    let data = await getProducts(page, limit, filters)
 

    createPagination(data.total, data.perPage, getProducts, displayProductTbl, filters);

});

    // tblBody.addEventListener("click", async (e) => {
    //     if (e.target.classList.contains("delete-btn")) {
    //         let productId = e.target.dataset.productId;
    //         await deleteProduct(productId);
    //     }
    // });




async function displayProductTbl(products) {
    const tblBody = document.getElementById("product-tbl-body")
  
    tblBody.innerHTML = ""; 

    products.forEach(async (product) => {
        console.log(product)
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
}

