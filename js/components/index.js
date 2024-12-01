import { sendRequest } from "../api.js";
import { fetchImageUrl, truncateDescription } from "../utils.js";

document.addEventListener("DOMContentLoaded", async function(e) {

    const slides = document.getElementsByClassName('slide-image');
 

    const totalSlides = slides.length;
    
    const productGrid = document.getElementById('productGrid');
    const arrowLeft = document.getElementById('arrowLeft');
    const arrowRight = document.getElementById('arrowRight');

    let currentSlide = 0;

    arrowLeft.addEventListener('click', () => {
      productGrid.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    });

    arrowRight.addEventListener('click', () => {
      productGrid.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    });

 
        
    let products = await getTrendProducts();
    await displayTrendProduct(products)
    async function getTrendProducts(){
        
        let response = await sendRequest("/products/trend", "GET");

        if(response.ok){
            let data = await response.json();
            return data.items;
            
        
        }

    }

    
    async function displayTrendProduct(products){
        productGrid.innerHTML = ""
        products.forEach(async(product) => {
            let objectUrl = await fetchImageUrl(product.image_url);
            let description = truncateDescription(product.description, 55)
            let item = `
            <div class="product">
             <img src="${objectUrl}" alt="${product.name}">
             <div class="product-name">${description}</div>
   
             <div class="price">$${product.price}</div>
             <a href="productDetail.html?productId=${product.id}">${product.name}</a>
           </div>
           `
           productGrid.innerHTML += item;
        });

    
    }

    function showSlide(index) {
        currentSlide = (index + totalSlides) % totalSlides;   
        const offset = -currentSlide * 100;                  
        document.getElementsByClassName('slide')[0].style.transform = `translateX(${offset}%)`;
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    setInterval(nextSlide, 2000);


    

})

