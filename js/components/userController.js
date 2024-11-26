import { sendAuthRequest } from "../api.js";
import { customerLevelColor } from "../constants.js";
import { createPagination, getUsers } from "../utils.js";

const page = 1;
const limit = 10;

let searchName = null;
document.addEventListener("DOMContentLoaded",async function(e){
    const searchBtn = document.getElementById("search-btn")
    let searchInputBox = document.getElementById("search-input");
    searchBtn.addEventListener("click", searchUser);
    searchInputBox.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            searchUser()
        }
    });
    
 
   await loadUserList()

})

async function searchUser(){

    let searchVal = document.getElementById("search-input").value;
   
    searchVal = searchVal.trim()

    if(searchVal.length > 0){
        searchName = searchVal;
        let data = await getUsers(page, limit, searchName);
        createPagination(data.total, data.perPage, getUsers, displayUsers, searchName);
    }
}

async function displayUsers(users){
    const tbdy= document.getElementById("user-tbl-body")
    tbdy.innerHTML = ""
    users.forEach(user => {
        let row = document.createElement("tr");
        let createdDate = new Date(user.createdAt);
        let createdDateStr = createdDate.toLocaleDateString(); 
        let createdTime = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
        let colorStr = customerLevelColor[user.userLevel]
        let customerLevel = user.userLevel.toUpperCase()
        
        let userType = user.isSuperuser ? "Admin" : "Customer"
        let userTypeColor = user.isSuperuser ? "red" : "black"
     
        
        row.innerHTML = `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td style="color: ${userTypeColor};">${userType}</td>
            <td style="color: ${colorStr};">${customerLevel}</td>
            <td>${createdDateStr} ${createdTime}</td>
            <td class="action-btns">
                <a class="btn btn-primary btn-bg" href="userReview.html?userId=${user.id}">Review</a>
                <a class="btn btn-danger btn-bg" href="userReview.html?userId=${user.id}">Delete</a>
            </td>
        </tr>
        `;
        console.log(tbdy)
        tbdy.appendChild(row)
       });
  }


async function loadUserList(){

   let data = await getUsers(page, limit)
   createPagination(data.total, data.perPage, getUsers, displayUsers, searchName);
}