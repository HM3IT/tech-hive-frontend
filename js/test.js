import { sentformRequest } from "./api.js";
async function uploadImage(formData) {
    let url = `/files/upload`;
    try {
    
        let response = await sentformRequest(url, "POST", formData);

        if (response.ok) {
            let result = await response.json();
            return result.file_path; 
        } else {
            console.error("Image upload failed:", response);
            alert("Error uploading image. Please try again.");
            return null;
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        alert("An unexpected error occurred during image upload.");
        return null;
    }
}
let productForm = document.getElementById("add-product-form")
productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await addProduct();
});



async function addProduct() {

let productImage = document.getElementById("product-image").files[0];


console.log(productImage)
let formData = new FormData();
formData.append("file", productImage);
 
 


let imageUrl = await uploadImage(formData);
if (!imageUrl) return;


let subImageUrls = await Promise.all(
  Array.from(subProductImages).map(async (file) => {
      return await uploadImage(file);
  })
);

return

}