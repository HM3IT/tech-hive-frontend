
import {deleteAccessTokenCookie, getCookie, showAlert } from './utils.js';
import {TOKEN_NAME, API_ENDPOINT,} from "./constants.js";

export async function sendRequest(url, method = "GET", data = null) {
    const options = {
        method: method,
        headers: {},
    };

    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }
    return await fetch(API_ENDPOINT + url, options);
}

export async function sendAuthRequest(url, method="GET", data = null) {
    const token = getCookie(TOKEN_NAME); 
    let headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }else{
        showAlert(`This feature Need User To Be Login!`, "#ff4d4d");
        window.location.href = "index.html";
        return null;
    }
 
    if (data) {
        console.log("Request Body:", JSON.stringify(data));
    }

    const options = {
        method: method,
        headers: headers,
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    let response = await fetch(API_ENDPOINT + url, options);
   
    if (!response.ok && response.status==401){
        showAlert("Token expired! Please login Again.", "#ff4d4d")
        window.location.href = "../client/login.html"
        deleteAccessTokenCookie()
    }
    else{
        return response
    }
}

export async function sentFormRequest(url, method, formData) {
    const token = getCookie(TOKEN_NAME); 
    
    if (!token) {
       showAlert("Need to be Admin!", "#ff4d4d")
       window.location.href = "./login.html"
       return null;
    }
    let headers = {'Authorization':`Bearer ${token}`};
    try {
        const response = await fetch(API_ENDPOINT + url, {
            method: method,
            headers: headers,
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Server error:", errorData);
            throw new Error(errorData.detail || "Request failed.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return null; 
    }
}
