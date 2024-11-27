import { sendAuthRequest, sendRequest, sentFormRequest } from "./api.js";
import { TOKEN_NAME, orderStatusColor, tagKeyLookup, tagColor} from "./constants.js";

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


export async function fetchImageUrl(imagePath) {
    let imageName = imagePath.split('/').pop();
    const response = await sendRequest(`/files/${imageName}`, "GET" );
    
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


export async function getProducts(page, limit, filters){
    let response = await sendRequest(`/products/search?query_str=${filters}&page=${page}&limit=${limit}`, "GET");
    if(response.ok){
      let data = await response.json();
      let products = data.items;
      let unwrappedProducts = products.map(item => item.document);
      return {
        total: data.total, 
        items: unwrappedProducts,
        perPage: data.per_page
      };
    }
    return {}   
}


function truncateDescription(description, maxLength = 30) {
    if (description.length > maxLength) {
        return description.slice(0, maxLength) + "...";
    }
    return description;
}


export async function displayProducts(products) {
    const productView = document.getElementById("productView");
    productView.innerHTML = '';

    for (const product of products) {
        let objectUrl = await fetchImageUrl(product.imageUrl);
  
        const dynamicTags = product.tags.map(tag => {
            if(tag.length <= 0){
                return
            }
            let tagName = tag.toLowerCase();
            const colorTagKey = tagKeyLookup[tagName] || tagKeyLookup.default;
     
            return `<span class="tag" style="background-color:${tagColor[colorTagKey]}">${tag}</span>`;
        }).join("");  


        let priceElement = ` <p class="product-price">Price: $${product.price}</p>`
        if(product.discountPercent >= 1){
            let discountPrice =  product.price * (1 - product.discountPercent / 100)
            priceElement  =`
             <p class="product-discount">Discount: ${product.discountPercent}%</p>  
            <p class="product-price">Price:
                <span style='text-decoration-line: line-through; color:red;'> $${product.price} </span>
                <span style='color:green;'>$${discountPrice.toFixed(2)}</span>
            </p>
             `
        }
        
        
        const productCard = `
            <div style="width: 26rem;" class="product-card card" data-id="${product.id}" data-price="${product.price}" data-discount="${product.discountPercent}">
                <img src="${objectUrl}" alt="${product.name}" class="product-image card-img-top">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">  ${truncateDescription(product.description, 85)}</p>
                 <div class="product-tags">
                    ${dynamicTags}
                    </div>
                <div class="flex">
                  ${priceElement}
                </div>
          
                <div class="product-button">               
                    <button  type="button" class="add-to-cart btn btn-success" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, 1, ${product.discountPercent}, '${product.imageUrl}')">Add to Cart</button>
                 
                    <a type="button" class="view-detail-btn" href="productDetail.html?productId=${product.id}">View detail</a> 
                </div>  
          
            </div>`;
        
        productView.innerHTML += productCard;
    }
}


export async function getCategory() {
    let currentPage = 1;
    let pageSize = 300;

    let url = `/categories/list?currentPage=${currentPage}&pageSize=${pageSize}`;

    let response = await sendRequest(url, "GET", null);

    if (response.ok) {
        let data = await response.json();
        return data.items;
    } else {
        console.log("Failed to fetch categories:", response);
    }
}

export async function getTags() {
    let currentPage = 1;
    let pageSize = 300;

    let url = `/tags/list?currentPage=${currentPage}&pageSize=${pageSize}`;

    let response = await sendRequest(url, "GET", null);

    if (response.ok) {
        let data = await response.json();
        return data.items;
    } else {
        console.log("Failed to fetch tags:", response);
    }
}

export async function fetchProductDetail(productId) {
    let url = `/products/detail/${productId}`;  
    let response = await sendRequest(url, "GET", null);
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
        showAlert("Product Updated Successfully!", "#28a745");
        return true;
    }  
    showAlert("Failed to Update Product!", "#ff4d4d");
    return false;
}


export async function getMyOrders(){
    let response = await sendAuthRequest("/orders/list", "GET")

    if (response.ok){
        let data = await response.json()
        return data.items || []
    }
    return null
}


export async function getUser(userId){
   let response = await sendAuthRequest(`/users/detail/${userId}`);
   if (response.ok){
        return await response.json()
    }
    return null
}


export async function fetchOrders() {
    let currentPage = 1; 
    let pageSize = 10;  

    let url = `/orders/list?currentPage=${currentPage}&pageSize=${pageSize}`;
    let response = await sendAuthRequest(url, "GET", null);

    if (response.ok) {
        let data = await response.json();
        return data.items
    } else {
        console.log("Failed to fetch products:", response);
    }
    return null;
}


export function addToCart(productId, productName, productPrice, quantity, discountPercent, imageUrl) {
    const token = getCookie(TOKEN_NAME); 
    if (!token){
        let isConfirm = showConfirmBox("To buy a product. Please login first", 
        ()=>window.location.href = "login.html",
        ()=>false
        );
        if(!isConfirm){
            return null;
        }
        
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    quantity = parseInt(quantity, 10);
 
    const existingProduct = cart.find((item) => item.productId === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    
    } else {
        cart.push({ productId: productId, name: productName, imageUrl, discountPercentAtOrder:discountPercent, priceAtOrder: productPrice, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    showAlert("Product Is Added to Cart Successfully!", "#28a745");

};


export function updateCartQuantity(productId, quantity) {
    console.log("Qnatity: ", quantity)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
 
    const product = cart.find((item) => item.productId === productId);

    if (product) {
        product.quantity = parseInt(quantity, 10);
     
        
        localStorage.setItem('cart', JSON.stringify(cart));


    // Update the specific row's total value dynamically
     const row = document.querySelector(`tr[data-id="${productId}"]`);
     if (row) {
         const discountPercent = product.discountPercentAtOrder || 0;
         const discountAmount = (product.priceAtOrder * discountPercent) / 100;
         const discountedPrice = product.priceAtOrder - discountAmount;
         const rowTotal = discountedPrice * product.quantity;
 
         const grandTotalCell = row.querySelector('.grand-total');
         if (grandTotalCell) {
             grandTotalCell.textContent = `$${rowTotal.toFixed(2)}`;
         }
     }
 
     updateGrandTotal(cart);
 }
}


export function updateGrandTotal(cart) {
    const grandTotal = cart.reduce((total, item) => {
        const discountPercent = item.discountPercentAtOrder || 0;
        const discountAmount = (item.priceAtOrder * discountPercent) / 100;
        const discountedPrice = item.priceAtOrder - discountAmount;
        return total + discountedPrice * item.quantity;
    }, 0);

    const grandTotalElement = document.getElementById('order-total');
    if (grandTotalElement) {
        grandTotalElement.innerText = `$${grandTotal.toFixed(2)}`;
    }
}


export function showConfirmBox(message, onOk, onCancel) {
    let infoBox = document.createElement("div");
    infoBox.setAttribute("id", "confirm-box");

    infoBox.innerHTML = `
        <div class="info-content">
            <p>${message}</p>
            <div class="info-buttons">
                <button id="info-ok" class="info-btn info-ok">OK</button>
                <button id="info-cancel" class="info-btn info-cancel">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(infoBox);

    // Event listeners for OK and Cancel
    document.getElementById("info-ok").addEventListener("click", async () => {
        infoBox.remove();
        if (onOk) onOk();
    });

    document.getElementById("info-cancel").addEventListener("click", async () => {
        infoBox.remove();
        if (onCancel) onCancel();
    });
}


export function showAlert(message, bg_color, duration = 3000) {
    let alertBox = document.createElement("div");
    alertBox.setAttribute("id", "alert-box");
    alertBox.className = "custom-alert-box";

    if (bg_color){
        alertBox.style.backgroundColor = bg_color;
    }
    alertBox.innerHTML = `
        <div class="alert-content">
            <p>${message}</p>
        </div>
    `;

    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.classList.add("fade-out");
        setTimeout(() => alertBox.remove(), 300);
    }, duration);
}


export async function getUsers(page, limit, searchName = null){
    let filters = `currentPage=${page}&pageSize=${limit}`
    if (searchName){
        filters += `&searchField=name&searchIgnoreCase=true&searchString=${searchName}`
    }
    let response = await sendAuthRequest(`/users/list?${filters}`, "GET");
    if(!response.ok){
        alert("Failed to retrieve user lists");
        return
    }    
        let data = await response.json()
      
      return {
        total: data.total, 
        items:  data.items,
        perPage: data.limit
      };   
}


 export async function getOrders(page, limit, searchId) {
  
    let url = `/orders/admin/list?currentPage=${page}&pageSize=${limit}`;

    if(searchId && searchId.length>0){
        url+= `&ids=${searchId}`

    }
    let response = await sendAuthRequest(url, "GET", null);

    if (response.ok) {
        let data =  await response.json();
        return {
            total: data.total, 
            items: data.items,
            perPage: data.limit
          };
   
    }  
        console.log("Failed to fetch products:", response);
        return {
            total: 0, 
            items:[],
            perPage: 10
          };
}



export async function displayOrderTable(orders, tblBody) {

    tblBody.innerHTML = ""; 
    orders.forEach(async (order) => {
        let row = document.createElement("tr");
        let user = await getUser(order.userId)
        let createdDate = new Date(order.createdAt);
        let orderDateStr = createdDate.toLocaleDateString(); 
        let orderTime = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
        let colorStr = orderStatusColor[order.status]
        let status = order.status.toUpperCase()
        
        row.innerHTML = `
            <tr>
                <td>${order.id}</td>
                <td>${user.name}</td>
                <td>${orderDateStr} ${orderTime}</td>
                <td class='order-status' style="color:${colorStr}">${status}</td>
                <td>$${order.totalPrice}</td>
                <td class="action-buttons">
                    <a class="review-btn" data-id="${order.id}" href="orderDetail.html?orderId=${order.id}">Review</a>
                </td>
            </tr>
        `;
        tblBody.appendChild(row);
    
    });

    tblBody.addEventListener("click", async (e) => {
        if (e.target.classList.contains("update-btn")) {
            let orderId = e.target.dataset.id;
            window.location.href=`orderStatusForm.html?productId=${orderId}`
        }
    });
}
