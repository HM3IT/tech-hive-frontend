import { sendAuthRequest } from "../api.js";
import { fetchImageUrl, fetchProductDetail, addToCart, showAlert, showConfirmBox, getCookie} from "../utils.js";
import {TOKEN_NAME} from "../constants.js";

document.addEventListener("DOMContentLoaded", async () => {
    const token = getCookie(TOKEN_NAME)
    const pageSize = 5;
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("productId");

    const prevBtn = document.getElementById("prevBtn")
    const nextBtn = document.getElementById("nextBtn")
    const mainImage = document.getElementById('mainImage');
    const starsContainer = document.getElementById("stars");
    const submitBtn = document.getElementById("submit-btn");
    const reviewText = document.getElementById("review-text");
    const thumbnails = document.getElementsByClassName("thumbnail");
    
    let stars = null

    if(starsContainer){
        stars = starsContainer.getElementsByClassName("rating");
    }

    
    if (!productId) {
        showError("Invalid Product ID. Please check the URL.");
        return;
    }
    
    let rating = 0;
    let currentPage = 1;  
    let currentImageIndex = 0;
    let hasAlreadyReivew = false
    let images =  await loadProduct(productId);
    if(document.getElementById("reviews-container")){

        await loadProductReview(productId);
    }

    let seeMoreBtn = document.getElementById("see-more-btn");

    if (seeMoreBtn){
        seeMoreBtn.addEventListener("click", () => {
            currentPage++; 
            loadProductReview(productId, true); 
        });
    }
    if(submitBtn){
        submitBtn.addEventListener("click", submitReviewHandler)
    }
    if(starsContainer){
        
        starsContainer.addEventListener("click", function (event) {
            
            if (event.target.tagName === "SPAN") {
                rating = event.target.getAttribute("data-rating");
                highlightStars(rating)
            }
        });
    }

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

    
        await displayOverallRating(product.overallRating);
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
    
        let mainObjectUrl = await fetchImageUrl(product.imageUrl);
        let images = [];


        if (product.imageUrl) {
            mainImage.src = mainObjectUrl;
            images.push(mainObjectUrl);
        } else {
            showError("Image not available for this product.");
        }

        if (product.subImageUrl && typeof product.subImageUrl === "object") {
            const subImgContainer = document.getElementById("thumbnail-container");

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
    
    async function submitReviewHandler(){
        let userReview = reviewText.value;
        if (hasAlreadyReivew){
            showAlert("You Have already review this product", "#ff4d4d")
            return;
        }
        if (userReview && userReview.trim().length <= 8){
        showAlert("Review Should Have At Least 8 Characters", "#ff4d4d")
        return;
        }
        if (rating <=0){
        showAlert("Please Give Rating For The Product.", "#ff4d4d");
        return;
        }
    
        const reviewData = {
            "productId": productId,
            "rating": rating,
            "reviewText": userReview
    }
        let response = await sendAuthRequest("/reviews/add","POST",reviewData);

        if(response.ok){
            rating = 0;
            reviewText.value =""
            showAlert("Your Review Has Submitted Successfully.", "#28a745");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        
        }

    }

    async function loadProductReview(productId, append = false) {
        if (!token){
            showConfirmBox("Please login first to see product detail", 
                ()=>window.location.href = "login.html",
                ()=>window.location.href = "products.html"
                );
            return null;
        }
        
        const response = await sendAuthRequest(`/reviews/detail/${productId}?pageSize=${pageSize}&currentPage=${currentPage}`);
        const productReviewContainer = document.getElementById("reviews-container");

        if (response.ok) {
            const data = await response.json();
            const reviews = data.items;
            hasAlreadyReivew = data.is_reviewed;

            if (!append) {
                productReviewContainer.innerHTML = "";
            }


            reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            reviews.forEach(async (review) => {
                const reviewElement = document.createElement("div");
                reviewElement.classList.add("user-profile");
                let objectUrl = null;
                if(review.profileUrl){
                    objectUrl = await fetchImageUrl(review.profileUrl);
                }else{
                    objectUrl = "../static/default-avatar-profile.jpg"
                }
                const ratingStars = "⭐".repeat(review.rating) + "☆".repeat(5 - review.rating);

                reviewElement.innerHTML = `
                    <div class="user-info">
                        <img src="${objectUrl}" alt="User Profile Picture">
                        <p class="username">User: <strong>${review.username}</strong></p>
                    </div>
                    <p><strong>Date:</strong> ${new Date(review.createdAt).toLocaleDateString()}</p>
                    <div class="rating">
                        <span>${ratingStars}</span>
                    </div>
                    <p>${review.review}</p>
                `;

                productReviewContainer.appendChild(reviewElement);
            });

            const seeMoreButton = document.getElementById("see-more-btn");
            if (data.total > currentPage * pageSize) {
                seeMoreButton.style.display = "inline-block";
            } else {
                seeMoreButton.style.display = "none";
            }
        } else {
            if (!append) {
                productReviewContainer.innerHTML = "<p>Failed to load reviews.</p>";
            }
        }
    }

    async function displayOverallRating(overallRating) {
        let overallRatingElement = document.getElementById("overall-rating");
        overallRatingElement.innerHTML = "";
    
 
        const fullStars = Math.floor(overallRating);
        const halfStar = overallRating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
    
    
        for (let i = 0; i < fullStars; i++) {
            const star = document.createElement("span");
            star.textContent = "⭐";  
            star.style.color = "gold";
            overallRatingElement.appendChild(star);
        }
 
        if (halfStar) {
            const star = document.createElement("span");
            star.textContent = "⭐";  
            star.style.color = "gold";
            overallRatingElement.appendChild(star);
        }
    
   
        for (let i = 0; i < emptyStars; i++) {
            const star = document.createElement("span");
            star.textContent = "☆";  
            star.style.color = "gray";
            overallRatingElement.appendChild(star);
        }
    }
 
});