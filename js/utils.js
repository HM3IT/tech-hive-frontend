import { sendRequest, sendAuthRequest } from "./api.js";

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
 
export async function createPagination(totalItems, productsPerPage, getProducts, displayProducts) {
    const totalPages = Math.ceil(totalItems / productsPerPage);
    console.log(`totalPages ${totalPages}`)
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = '';  
 
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&laquo;';
    prevButton.onclick = async () => {
        if (currentPage > 1) {
            currentPage--;
            let products = await getProducts(currentPage);
            console.log(products.items);
            displayProducts(products.items);
        }
    };
    paginationControls.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.onclick = async () => {
            currentPage = i;
            let products = await getProducts(currentPage);
            console.log(products.items);
            displayProducts(products.items);
        };
        paginationControls.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&raquo;';
    nextButton.onclick = async () => {
        if (currentPage < totalPages) {
            currentPage++;
            let products = await getProducts(currentPage);
            console.log(products.items);
            console.log("CLICKEd")
            displayProducts(products.items);
        }
    };
    paginationControls.appendChild(nextButton);
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
