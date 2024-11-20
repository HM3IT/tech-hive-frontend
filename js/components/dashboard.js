
loadComponent("dashboardSidebar.html", "admin-sidebar")
.then(message => {
    const currentUrl = window.location.pathname.split("/");
    let currnetPage = currentUrl[currentUrl.length -1]
    let key = currnetPage.split(".")[0]
    const pageBtnMapper ={
        dashboard:  'dashboard-btn',
        products:'product-btn',
        orders:'order-btn',
        users:'user-btn',
        setting:'setting-btn',
        logout: 'logout-btn'
    }
   
    highlightButton( pageBtnMapper[key])
})
.catch(error => console.error(error));


function highlightButton(buttonId) {
    console.log("trigger ",buttonId)
 
    const defaultBackgroundColor = "##1f1f38;";
    const defaultTextColor = "#f4f6f8";
 
    const highlightBackgroundColor = "#2a2a72";
    const highlightTextColor = "#ffffff";

 
    const buttonIds = [
        'dashboard-btn',
        'product-btn',
        'order-btn',
        'user-btn',
        'setting-btn',
        'logout-btn'
    ];

  
    buttonIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            if (id === buttonId) {
           
                btn.style.backgroundColor = highlightBackgroundColor;
                btn.style.color = highlightTextColor;
            } else {
            
                btn.style.backgroundColor = defaultBackgroundColor;
                btn.style.color = defaultTextColor;
            }
        }
    });
}