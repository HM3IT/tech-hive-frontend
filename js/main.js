function loadComponent(url, placeholderId) {
    return new Promise((resolve, reject) => {
        fetch(`./components/${url}`)
            .then(response => response.text())
            .then(html => {
                const element = document.getElementById(placeholderId);
                if (element) {
                    element.innerHTML = html;
                    resolve(`Component loaded into #${placeholderId}`);
                } else {
                    // reject(`Placeholder with ID '${placeholderId}' not found.`);
                }
            })
            .catch(err => reject(`Error loading the component: ${err}`));
    });
}
 