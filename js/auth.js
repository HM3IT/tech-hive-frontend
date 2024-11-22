
import { setAccessTokenCookie, deleteAccessTokenCookie } from './utils.js';
import { sendRequest, sendAuthRequest } from './api.js';


const redirectDelayTime = 2000
 
export async function signin(event) {
	event.preventDefault();

	let email = document.getElementById('signin-email').value;
	let password = document.getElementById('signin-password').value;
 
	let response = await sendRequest('/access/login', 'POST', { email, password });
	
	if (response.ok) {
		let responseData = await response.json();
		const token = responseData.access_token	;  
		console.log("token")
		console.log(token)
		const expireTimeMs = responseData.expireDate
	 
		setAccessTokenCookie(token, expireTimeMs);   
		console.log('Login successful and token stored in cookies');
		alert("login successfull")
		window.location.href = "./index.html"
	} else {
		let errorData = await response.json();
		console.log(errorData)
	 
	}
}

 
export async function signup() {
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
	 
	let response = await sendRequest('/access/signup', 'POST', { email, password, "name":username });
	
	if (response.ok) {
		let responseData = await response.json();
		const token = responseData.access_token	;  
		console.log("token")
		console.log(token)
		const expireTimeMs = responseData.expireDate
	 
		setAccessTokenCookie(token, expireTimeMs);   
		alert(`User ${username} registered successfully!`);
		window.location.href = "./index.html";
	} else {
		let errorData = await response.json();
		console.log(errorData)
	 
	}	 
}


export async function logout(){
	
	let response = await sendAuthRequest('/access/logout', 'POST', null);
	if (response.ok) {
		deleteAccessTokenCookie();     
		alert(`Logout successfully!`);
		window.location.href = "./index.html";
	} else {
		let errorData = await response.json();
		console.log(errorData)
	 
	}	 
}



export async function me(){
	let response = await sendAuthRequest('/access/me', 'GET');
	if (response.ok) {
		return response.json()
	} else {
		let errorData = await response.json();
		console.log(errorData)
	}	 
}