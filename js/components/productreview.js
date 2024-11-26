// JavaScript for See More / See Less functionality
document.addEventListener("DOMContentLoaded", function () {
    const reviewsContainer = document.getElementById("reviews-container");
    const userProfiles = reviewsContainer.getElementsByClassName("user-profile");
    const seeMoreBtn = document.getElementById("see-more-btn");
    const seeLessBtn = document.getElementById("see-less-btn");

    const MAX_VISIBLE_REVIEWS = 5; // Number of reviews to show initially

    // Hide all reviews beyond the initial limit
    const hideExcessReviews = () => {
        for (let i = MAX_VISIBLE_REVIEWS; i < userProfiles.length; i++) {
            userProfiles[i].style.display = "none";
        }
    };

    // Show all reviews
    const showAllReviews = () => {
        for (let i = MAX_VISIBLE_REVIEWS; i < userProfiles.length; i++) {
            userProfiles[i].style.display = "block";
        }
    };

    // Initially hide excess reviews
    hideExcessReviews();

    // Add event listener for "See More" button
    seeMoreBtn.addEventListener("click", function () {
        showAllReviews();
        seeMoreBtn.style.display = "none";
        seeLessBtn.style.display = "inline-block";
    });

    // Add event listener for "See Less" button
    seeLessBtn.addEventListener("click", function () {
        hideExcessReviews();
        seeLessBtn.style.display = "none";
        seeMoreBtn.style.display = "inline-block";
    });
});
