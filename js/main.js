// mimic the usage of env variable 
window.env = {
    API_BASE: "http://localhost:8000/api"
};


function loadComponent(url, placeholderId) {
    console.log("url", url)
    console.log("placeholderId", placeholderId)
    fetch("../components/"+url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(placeholderId).innerHTML = html;
        })
        .catch(err => console.error('Error loading the component:', err));
}