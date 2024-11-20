import { sendAuthRequest, sendRequest, sentFormRequest } from "./api.js";

export const TOKEN_NAME = "accessToken"
export const API_ENDPOINT = "http://localhost:8000/api"
export let currentPage = 1
export function setAccessTokenCookie(token, expiryTimeInMs) {
    const expires = new Date(Date.now() + expiryTimeInMs);
    document.cookie = `${TOKEN_NAME}=${token}; expires=${expires.toUTCString()}; path=/; secure; SameSite=Strict`;
}

export function deleteAccessTokenCookie() {
    document.cookie = `${TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; SameSite=Strict`;
}

export function getCookie(name) {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        cookie = cookie.trim();  
        if (cookie.startsWith(nameEQ)) {
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}
 
 
export function createPagination(totalItems, itemsPerPage, fetchFunction, displayFunction, filters) {
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


export async function getProducts(page, limit, filters){
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

export async function displayProducts(products) {
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


export async function getCategory() {
    let currentPage = 1;
    let pageSize = 300;

    let url = `/categories/list?currentPage=${currentPage}&pageSize=${pageSize}`;

    let response = await sendAuthRequest(url, "GET", null);

    if (response.ok) {
        let data = await response.json();
        return data.items;
    } else {
        console.log("Failed to fetch categories:", response);
    }
}


export async function fetchProductDetail(productId) {
    let url = `/products/detail/${productId}`;  
    let response = await sendAuthRequest(url, "GET", null);
    if (response.ok) {
        return await response.json();
    } else {
        console.log("Failed to fetch product:", productId);
    }
}


export async function uploadImage(file) {
    let formData = new FormData();
    formData.append("file", file);

    let url = `/files/upload`;
    try {
    
        let result = await sentFormRequest(url, "POST", formData);

       
        return result.file_path; 
        
    } catch (error) {
        console.error("Error uploading image:", error);
        alert("An unexpected error occurred during image upload.");
        return null;
    }
}


export async function updateProduct(productId, productData){
    let url = `/products/update/${productId}`;
    let response = await sendAuthRequest(url, "PATCH", productData);

    if (response.ok) {
        alert("Product updated successfully!");
        return true;
    }  
    alert("Failed to update product.");
    return false;  
     
}

export async function fetchImageUrl(imagePath) {
    let imageName = imagePath.split('/').pop();
    const response = await sendAuthRequest(`/products/images/${imageName}`, "GET" );
    
    if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);  
    }

    return 'static/fallback-img.jpg'; 
}



export async function getSubImagUrls(files){
    let subImageUrls = await Promise.all(
        Array.from(files).map(async (file) => {
            return await uploadImage(file);
        })
    );
    let subImgUrlObj = {};
    subImageUrls.forEach((url, index) => {
        let key;
        switch (index) {
            case 0:
                key = 'first';
                break;
            case 1:
                key = 'second';
                break;
            case 2:
                key = 'third';
                break;
            case 3:
                key = 'fourth';
                break;
            default:
                key = `image${index + 1}`;
        }
        subImgUrlObj[key] = url;
    });
    return subImgUrlObj;
}