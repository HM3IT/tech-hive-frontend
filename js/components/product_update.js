import { sendAuthRequest } from "../api.js";
import { fetchProductDetail, getSubImagUrls, getCategory, getTags, updateProduct, uploadImage } from "../utils.js";
import {tagKeyLookup, tagColor} from "../constants.js";

document.addEventListener("DOMContentLoaded", async () => {

    let productId =""
    let oldProduct;

    let dropDownCategory = document.getElementById("product-category");
    let dropDownTags = document.getElementById("product-tags");

    let urlParams = new URLSearchParams(window.location.search);
    productId = urlParams.get("productId");
    if (!productId) {
        alert("Product ID is missing!");
        window.location.href = "../admin/products.html";  
        return;
    }
    await loadOldProduct(productId);

    const updateForm = document.getElementById("update-product-form");
    updateForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await updateProductHandler();
    });
    const cancelBtn = document.getElementById("cancel-btn")

    cancelBtn.addEventListener("click", () => {
        updateForm.reset()
    });

   

async function loadOldProduct(productId) {
    oldProduct = await fetchProductDetail(productId)

    document.getElementById("product-name").value = oldProduct.name;
    document.getElementById("product-brand").value = oldProduct.brand || "";
    document.getElementById("product-stock").value = oldProduct.stock;
    document.getElementById("product-price").value = oldProduct.price;
    document.getElementById("product-discount").value = oldProduct.discountPercent || 0;
    document.getElementById("product-description").value = oldProduct.description || "";
    
    
    let categories = await getCategory();
    let tags = await getTags();
  
 
    categories.forEach((category) => {
        let optionElement = document.createElement("option");
        optionElement.value = category.id;
        optionElement.innerText = category.name;
        if(category.id == oldProduct.categoryId){
            optionElement.selected =true;
        }
        dropDownCategory.appendChild(optionElement);
    });

    const oldTagIds = oldProduct.productTags.map((tag) => (tag.tagId));
    tags.forEach((tag) => {
        console.log(tag)
        let optionElement = document.createElement("option");
        optionElement.value = tag.id;
        optionElement.innerText = tag.name;
        console.log(tag.id)
        console.log(oldTagIds)
 
    
            let tagName = tag.name.toLowerCase()
            const colorTagKey = tagName in tagKeyLookup ? tagKeyLookup[tagName] : tagKeyLookup.DEFAULT;
        
       
            optionElement.style.borderLeft = `7px solid ${tagColor[colorTagKey]}`;
      
            optionElement.selected = true;
   
        dropDownTags.appendChild(optionElement);
    });
}

async function updateProductHandler() {
    let tagIds = Array.from(dropDownTags.selectedOptions).map(option => option.value);
    let categoryId = dropDownCategory.value;
    let name = document.getElementById("product-name").value.trim();
    let brand = document.getElementById("product-brand").value.trim();
    let stock = parseInt(document.getElementById("product-stock").value);
    let price = parseFloat(document.getElementById("product-price").value);
    let discountPercent = parseFloat(document.getElementById("product-discount").value) || 0;
    let description = document.getElementById("product-description").value.trim();
    let productImage = document.getElementById("product-image").files;
    let subProductImages = document.getElementById("sub-product-image").files;
    

    let imageUrl = oldProduct.imageUrl;
    let subImageUrl = oldProduct.subImageUrl;
    if (productImage.length > 0){
        imageUrl = await uploadImage(productImage[0]);
    }
    
    if (subProductImages.length > 0){
        subImageUrl = await getSubImagUrls(subProductImages)
    }
    if (!imageUrl || !subImageUrl){
        return
    }
    let productData = {
        name,
        description,
        price,
        brand,
        categoryId,
        stock,
        discountPercent,
        imageUrl, 
        subImageUrl,  
        tagIds
    };
  

    let isSuccess = await updateProduct(oldProduct.id, productData);
    if(isSuccess){
        window.location.reload()
    }
}


});