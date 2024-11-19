
import {TOKEN_NAME, API_ENDPOINT, getCookie } from './utils.js';
 

export async function sendRequest(url, method="GET", data = null) {
    let headers = {
        'Content-Type': 'application/json',
    };

    const options = {
        method: method,
        headers: headers,
    };

    if (data) {
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
        // window.location.href = "./index.html"
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

    return await fetch(API_ENDPOINT + url, options);
}

export async function sentformRequest(url, method, formData) {
    const token = getCookie(TOKEN_NAME); 
    
    if (!token) {
       alert("Need to be admin")
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
