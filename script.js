// script.js

const images = [
    'static/images/13.jpg', // Replace with actual paths
    'static/images/14.jpg',
    'static/images/15.jpg',
    'static/images/16.jpg'
];

let currentImageIndex = 0;
const mainImage = document.getElementById('mainImage');
const thumbnails = document.querySelectorAll('.thumbnail');

// Update the main image and active thumbnail
function updateImage(index) {
    mainImage.src = images[index];
    thumbnails.forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === index);
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

function showImage(index) {
    currentImageIndex = index;
    updateImage(currentImageIndex);
}

// Initialize the first image as active
updateImage(currentImageIndex);

// Rating Functionality
function rateProduct(rating) {
    const stars = document.querySelectorAll('.stars span');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
    document.getElementById('userRating').innerText = `You rated this product ${rating} stars`;
}
