import { sendAuthRequest } from "../api.js";
import { fetchImageUrl, fetchProductDetail, addToCart, updateCartQuantity , updateGrandTotal } from "../utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    let rating = 0;
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("productId");
    const prevBtn = document.getElementById("prevBtn")
    const nextBtn = document.getElementById("nextBtn")
    const mainImage = document.getElementById('mainImage');
    const starsContainer = document.getElementById("stars");
    const stars = starsContainer.getElementsByClassName("rating");
    const submitBtn = document.getElementById("submit-btn");
    const reviewText = document.getElementById("review-text");

 

    submitBtn.addEventListener("click", async function (){
       let userReview = reviewText.value;
       if (userReview.length <= 8){
        alert("review should have at least 8 characters")
        return;
       }
       if (rating <=0){
        alert("Please give rating for the product");
        return;
       }
       const url = "/reviews/add"
       const reviewData = {
        "productId": productId,
        "rating": rating,
        "reviewText": userReview
      }
       let response = await sendAuthRequest(url,"POST",reviewData);

       if(response.ok){
        let data = await response.json();
        console.log(data)
       }

    })


    starsContainer.addEventListener("click", function (event) {
      
        if (event.target.tagName === "SPAN") {
            rating = event.target.getAttribute("data-rating");
            highlightStars(rating)
        }
    });

    
    let thumbnails = null
    let currentImageIndex = 0;

    if (!productId) {
        showError("Invalid Product ID. Please check the URL.");
        return;
    }


        
    let images =  await loadProduct(productId);

    await loadProductReview(productId);

    thumbnails = document.getElementsByClassName("thumbnail");

    function updateImage(index) {
            mainImage.src = images[index];
            Array.from(thumbnails).forEach((thumb, idx) => {
                if (idx === index) {
                    thumb.classList.add('active');  
                } else {
                    thumb.classList.remove('active'); 
                }
            });
        }

    function prevImage() {
        currentImageIndex = (currentImageIndex === 0) ? images.length - 1 : currentImageIndex - 1;
        updateImage(currentImageIndex);
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex === images.length - 1) ? 0 : currentImageIndex + 1;
        updateImage(currentImageIndex);
    }

    
    updateImage(currentImageIndex);

    
    prevBtn.addEventListener("click", prevImage)
    nextBtn.addEventListener("click", nextImage)
     
    
function highlightStars(rating) {
    

    for (let i = 0; i < stars.length; i++) {
        if (i < rating) {
            stars[i].classList.add("highlight");
        } else {
            stars[i].classList.remove("highlight");
        }
    }
}


async function loadProduct(productId){
    const product = await fetchProductDetail(productId);

    let productName = document.getElementById("product-name");
    let brandSpan = document.getElementById("brand");
    let originalPrice = document.getElementById("original-price");
    let discountedPrice = document.getElementById("discounted-price");
    let discount = document.getElementById("discount");
    let availability = document.getElementById("availability");
    let descriptionSpan = document.getElementById("description");
    let userRating = document.getElementById("userRating");
    let discountedPriceValue = product.price - (product.price * product.discountPercent) / 100;



    productName.innerText = product.name;
    brandSpan.innerText = product.brand;
    originalPrice.innerText = `${product.price}$`;
    if(product.discountPercent >= 1){
        discount.innerText = `Discount: ${product.discountPercent}% OFF`;
        discountedPrice.innerText = `${discountedPriceValue.toFixed(2)}$`;
        originalPrice.style.textDecorationLine = "line-through";
        originalPrice.style.color = "red";
        discountedPrice.style.color = "green";
    }
    availability.innerText = `Available Quantity: ${product.stock}`;
    descriptionSpan.innerText = product.description;
 

    // Image Fetching
    let mainObjectUrl = await fetchImageUrl(product.imageUrl);
    let images = [];


    if (product.imageUrl) {
        mainImage.src = mainObjectUrl;
        images.push(mainObjectUrl)
    } else {
        showError("Image not available for this product.");
    }

    if (product.subImageUrl && typeof product.subImageUrl === "object") {
        const subImgContainer = document.getElementById("thumbnail-container")

        let mainThumbElement = document.createElement("img");
        mainThumbElement.src = mainObjectUrl;
        mainThumbElement.alt = `Main image`;
        mainThumbElement.className = "sub-image thumbnail";  

        subImgContainer.appendChild(mainThumbElement)
        for (const [key, url] of Object.entries(product.subImageUrl)) {
            try {
                const objectUrl = await fetchImageUrl(url);
              
                const subImageElement = document.createElement("img");
                subImageElement.src = objectUrl;
                subImageElement.alt = `${key} image`;
                subImageElement.className = "sub-image thumbnail";  
    
                subImgContainer.appendChild(subImageElement);
                images.push(objectUrl)
            } catch (error) {
                console.error(`Failed to fetch sub-image for ${key}:`, error);
            }
        }
    } else {
        console.log("No sub-images available.");
    }

    const addCartBtn  = document.getElementById("add-to-cart");
    if(addCartBtn){

        addCartBtn.addEventListener("click", addProductToCart);
    }

    function addProductToCart(){
        const quantityCounter = document.getElementById("quantityInput")
        addToCart(product.id, product.name, product.price, quantityCounter.value, product.discountPercent, product.imageUrl)
    }
    return images;
}
 
async function loadProductReview(productId) {
    const response = await sendAuthRequest(`/reviews/detail/${productId}`);
    const productReviewContainer = document.getElementById("reviews-container");

    if (response.ok) {
        const data = await response.json();
        const reviews = data.items;

        productReviewContainer.innerHTML = "";

        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    
        reviews.forEach(review => {
            const reviewElement = document.createElement("div");
            reviewElement.classList.add("user-profile");

            const ratingStars = "⭐".repeat(review.rating) + "☆".repeat(5 - review.rating);

            reviewElement.innerHTML = `
                <div class="user-info">
                    <img src="../static/images/1.jpg" alt="User Profile Picture">
                    <p class="username">User ID: ${review.userId}</p>
                </div>
                <p><strong>Date:</strong> ${new Date(review.createdAt).toLocaleDateString()}</p>
                <div class="rating">
                    <span>${ratingStars}</span>
                </div>
                <p>${review.reviewText}</p>
            `;

            productReviewContainer.appendChild(reviewElement);
        });
    } else {
        productReviewContainer.innerHTML = "<p>Failed to load reviews.</p>";
    }
}

});