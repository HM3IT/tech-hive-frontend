function loadComponent(url, placeholderId) {

    fetch("./components/"+url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(placeholderId).innerHTML = html;
        })
        .catch(err => console.error('Error loading the component:', err));
}


window.onload = function() {
    loadComponent('nav.html', 'nav');
    loadComponent('footer.html', 'footer');
};
 