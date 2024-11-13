export const TOKEN_NAME = "accessToken"
export const API_ENDPOINT = "http://localhost:8000/api"

export function setAccessTokenCookie(token, expiryTimeInMs) {
    const expires = new Date(Date.now() + expiryTimeInMs);
    document.cookie = `${TOKEN_NAME}=${token}; expires=${expires.toUTCString()}; path=/; secure; SameSite=Strict`;
}

export function getCookie(name) {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        cookie = cookie.trim();  
        if (cookie.startsWith(nameEQ)) {
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}

// utils.js





