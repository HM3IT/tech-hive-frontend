import { fetchImageUrl, fetchProductDetail, addToCart, updateCartQuantity , updateGrandTotal } from "../utils.js";

document.addEventListener("DOMContentLoaded", async () => {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("productId");
        const prevBtn = document.getElementById("prevBtn")
        const nextBtn = document.getElementById("nextBtn")
        const mainImage = document.getElementById('mainImage');
  
       
        
        let thumbnails = null
        let currentImageIndex = 0;

        if (!productId) {
            showError("Invalid Product ID. Please check the URL.");
            return;
        }

 
         
        let images =  await loadProduct(productId)

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
        
});

 
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
    userRating.innerText = `Current Rating: ${product.rating || "No ratings yet"} stars`;

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
 

  