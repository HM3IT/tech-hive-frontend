function loadComponent(url, placeholderId) {

    fetch("./components/"+url)
        .then(response => response.text())
        .then(html => {
            let element = document.getElementById(placeholderId);
            if (element){
                element.innerHTML = html;
            }
        })
        .catch(err => console.error('Error loading the component:', err));
}


window.onload = function() {
    loadComponent('nav.html', 'nav');
    loadComponent('footer.html', 'footer');
};
 