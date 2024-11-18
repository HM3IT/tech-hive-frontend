// add_product.js

// Function to add a new product by calling the backend API
async function addProduct(productData) {
    try {
        const response = await fetch('http://localhost:8000/api/products/add', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzE2NDY5NDcsInN1YiI6ImhlaW5taW5AZ21haWwuY29tIiwiaWF0IjoxNzMxNTYwNTQ3LCJleHRyYXMiOnt9fQ.CCSVe_oTWCVPpfcpX0P084Q901SAyUXQj6KPIQNLM5M', // Use your actual token here
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            return await response.json(); // Return response JSON if successful
        } else {
            throw new Error('Failed to add product');
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Event listener for form submission
document.querySelector(".add-product-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const productData = {
        name: document.getElementById("product-name").value,
        description: document.getElementById("product-description").value,
        price: parseFloat(document.getElementById("product-price").value),
        imageUrl: document.getElementById("product-image").files[0] ? document.getElementById("product-image").files[0].name : "",
        brand: "string",  
        categoryId: document.getElementById("product-category").value,
        subImageUrl: Array.from(document.getElementById("sub-product-image").files).map(file => file.name),
        stock: 0, 
        discountPercent: 0 
    };

    try {
        const result = await addProduct(productData);
        alert("Product added successfully!");
        document.querySelector(".add-product-form").reset();
    } catch (error) {
        alert("Failed to add product.");
    }
});
