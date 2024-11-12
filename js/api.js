
import { setCookie, getCookie } from './utils.js';
const API_BASE = window.env.API_URL

export async function sendRequest(url, data) {
    return await fetch(API_BASE + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export async function sendAuthRequest(url, method="GET", data = null) {
    const token = getCookie('auth_token'); 
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

    return await fetch(API_BASE + url, options);
}
