
import { setAccessTokenCookie, deleteAccessTokenCookie, showAlert } from './utils.js';
import { sendRequest, sendAuthRequest } from './api.js';


const redirectDelayTime = 2000
 
export async function signin(event) {
	event.preventDefault();

	let email = document.getElementById('signin-email').value;
	let password = document.getElementById('signin-password').value;
	let response = await sendRequest('/access/login', 'POST', { email, password });

    if (!email || !password) {
        showAlert("All Fields Are Required!", "#ff4d4d");
        return;
    }

	if (response.ok) {
		let responseData = await response.json();
		const token = responseData.access_token	;  
		const expireTimeMs = responseData.expireDate
	 
		setAccessTokenCookie(token, expireTimeMs);   
		showAlert("Login Successfull", "#28a745")
		setTimeout(() => {
            window.location.href = "./index.html";
        }, 1000); 
    } else {
        showAlert("Oops! Login Failed. Check Email or Password.", "#ff4d4d");
    }
}

 
export async function signup() {
    const username = document.getElementById("signup-name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("signup-password").value;
    const terms = document.getElementById("terms").checked;

    if (!terms) {
        showAlert("You Must Accept The Terms To Register!", "#ff4d4d");
        return;
    }
 
    if (!username || !email || !password) {
        showAlert("All Fields Are Required!", "#ff4d4d");
        return;
    }
	 
	let response = await sendRequest('/access/signup', 'POST', { email, password, "name":username });
	
	if (response.ok) {
		let responseData = await response.json();
		const token = responseData.access_token	;  
		const expireTimeMs = responseData.expireDate
	 
		setAccessTokenCookie(token, expireTimeMs);   
		showAlert(`${username} Registered Successfully!`, "#28a745");
		setTimeout(() => {
            window.location.href = "./index.html";
        }, 1000); 
	} else {
		let errorData = await response.json();
		console.log(errorData)
	 
	}	 
}


export async function logout(){
	
	let response = await sendAuthRequest('/access/logout', 'POST', null);
	if (response.ok) {
		deleteAccessTokenCookie();     
		showAlert("Logout Successfully!", "#28a745");
        setTimeout(() => {
            window.location.href = "./index.html";
        }, 1000); 	} else {
		let errorData = await response.json();
		console.log(errorData)
	 
	}	 
}


export async function me(){
	let response = await sendAuthRequest('/access/me', 'GET');
	if (response.ok) {
		return response.json();
	} else {
		let errorData = await response.json();
		console.log("errorData")
		console.log(errorData)
		if (errorData.status_code == 401){
			deleteAccessTokenCookie()
		}
		console.log(errorData)
	}	 
}