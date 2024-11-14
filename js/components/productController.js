import { sendRequest } from "../api.js";


let dropDownCategory =document.getElementById("product-category");


document.addEventListener("DOMContentLoaded", async()=>{
    let categories = await getCategory();
    // dropDownCategory.
    console.log(categories)
    categories.forEach(category => {
        let optionElement = document.createElement("option");
        optionElement.value = category.id
        optionElement.text = category.name
         console.log(optionElement)
         dropDownCategory.appendChild(optionElement)
        
    });
    
})


async function getCategory(){
    let currentPage = 1
    let pageSize = 250

    let url = `/categories?currentPage=${currentPage}&pageSize=${pageSize}`

    let response = await sendRequest(url)

    if (response.ok){
        let data = await response.json();
        return data.items

    }else{
        console.log(response.error)
    }

}