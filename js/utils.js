export const TOKEN_NAME = "accessToken"
export const API_ENDPOINT = "http://localhost:8000/api"

export function setAccessTokenCookie(token, expiryTimeInMs) {
    const expires = new Date(Date.now() + expiryTimeInMs);
    document.cookie = `${TOKEN_NAME}=${token}; expires=${expires.toUTCString()}; path=/; secure; SameSite=Strict`;
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
 
export async function createPagination(totalItems, currentPage, productsPerPage, getProducts, displayProducts) {
    const totalPages = Math.ceil(totalItems / productsPerPage);
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = '';  

    const prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.innerHTML = '&laquo;';
    prevLink.onclick = async (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;

            // Use await here safely since the function is async
            let products = await getProducts(currentPage);
            console.log(products.items)
            // displayProducts(products.items);
        }
    };

    paginationControls.appendChild(prevLink);


    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.innerText = i;
        pageLink.className = currentPage === i ? 'active' : '';
        pageLink.addEventListener('click', async (e) => {
            e.preventDefault();
            let products = await getProducts(currentPage=currentPage)
            console.log(products.items)
            // displayProducts(products.items);
        });
        paginationControls.appendChild(pageLink);
    }

    const nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.innerHTML = '&raquo;';
    nextLink.onclick = async(e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            let products = await getProducts(currentPage=currentPage)
            console.log(products.items)
            // displayProducts(products.items);
        }
    };
    paginationControls.appendChild(nextLink);
}



