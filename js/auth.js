
import { setAccessTokenCookie, getCookie } from './utils.js';
import { sendRequest, sendAuthRequest } from './api.js';


const redirectDelayTime = 2000
 
export async function signin(event) {
	event.preventDefault();

	let email = document.getElementById('signin-email').value;
	let password = document.getElementById('signin-password').value;
 
	let response = await sendRequest('/access/login', { email, password }, 'POST');
	
	if (response.ok) {
		let responseData = await response.json();
		const token = responseData.access_token	;  
		console.log("token")
		console.log(token)
		const expireTimeMs = responseData.expireDate
	 
		setAccessTokenCookie(token, expireTimeMs);   
		console.log('Login successful and token stored in cookies');
	} else {
		let errorData = await response.json();
		console.log(errorData)
	 
	}
}

export async function logout(event) {
	event.preventDefault();

	let response = await sendAuthRequest('/api/access/logout', 'POST');

	if (response.ok) {
		setTimeout(function () {
			window.location.href = '/';
		}, redirectDelayTime);
		console.log(response.json())
	} else {
		let errorData = await response.json();
	 
	}
}


// auth.js

export function signup(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById("signup-name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("signup-password").value;
    const terms = document.getElementById("terms").checked;

    if (!terms) {
        alert("You must accept the terms to register.");
        return;
    }

    // Simple validation and feedback (extend this logic as needed)
    if (!username || !email || !password) {
        alert("All fields are required.");
        return;
    }

    // Registration logic here (example)
    // In a real application, replace this with a request to your backend
    alert(`User ${username} registered successfully!`);

    // Redirect to a different page or reset form
    window.location.href = "/index.html";
}
