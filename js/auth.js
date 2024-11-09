

const API_BASE = "http://localhost:8000"
async function sendRequest(url, data, method, token =null) {

	header = {
	'Content-Type': 'application/json',
	}
    return await fetch(API_BASE+url, {
        method: method,
        headers: header,
        body: JSON.stringify(data),
        // body: JSON.stringifydata,
    });
}

async function signin(event) {
	event.preventDefault();

	let email = document.getElementById('signin-email').value;
	let password = document.getElementById('signin-password').value;
 

	let signinData = { email, password };
	let response = await sendRequest('/api/access/login', signinData, 'POST');
	
	if (response.ok) {
		// setTimeout(function () {
		// 	window.location.href = '/';
		// }, redirectDelayTime);
		console.log(response.json())
	} else {
		let errorData = await response.json();
		console.log(errorData)
	 
	}
}

async function logout(event) {
	event.preventDefault();

 
	let signinData = { email, password };
	let response = await sendRequest('/api/access/logout', signinData, 'POST');

	if (response.ok) {
		// setTimeout(function () {
		// 	window.location.href = '/';
		// }, redirectDelayTime);
		console.log(response.json())
	} else {
		let errorData = await response.json();
	 
	}
}


async function signup(event) {
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
 