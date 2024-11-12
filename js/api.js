
import {TOKEN_NAME, API_ENDPOINT, getCookie } from './utils.js';
 

export async function sendRequest(url, data) {
    return await fetch(API_ENDPOINT + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export async function sendAuthRequest(url, method="GET", data = null) {
    const token = getCookie(TOKEN_NAME); 
    let headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }else{
        window.location.href = "login.html"
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
