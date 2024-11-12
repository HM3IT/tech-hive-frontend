
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


export async function signup(event) {
	event.preventDefault();

	let name = document.getElementById('signup-name').value;
	let email = document.getElementById('signup-email').value;
	let password = document.getElementById('signup-password').value;
 

	let signupData = { name, email, password };
	console.log(signupData)
	let response = await sendRequest('/api/access/signup', signupData, 'POST');

	if (response.ok) {
		console.log("Sign up successful")
		console.log(response.json())
	} else {
		let errorData = await response.json();
	 
	}
}
 