export const TOKEN_NAME = "accessToken"
export const API_ENDPOINT = "http://localhost:8000/api"

export const orderStatusColor = {
    pending :"orange",
    confirm: "blue",
    cancelled: "red",
    shipped: "#a64e00",
    delivered : "green"
}

export const customerLevelColor = {
    classic: "#000000", 
    silver: "#C0C0C0",
    gold: "#FFD700",   
    platinum: "#4B0082"  
}

export const tagColorKey  ={
    NEW_ARRIVAL: "new arrival",
    FLASH_SALE: "flash sales",
    PROMOTION: "promotion",
    BEST_SELLER: "best seller",
    DISCOUNTED: "discounted",
    TRENDING: "trending",
    PRE_ORDER: "pre-order",
    FREE_SHIPPING: "free shipping",
    GIFT_IDEAS: "gift ideas",
    CUSTOMER_FAVORITE: "customer favorite",
    HIGHLY_RATED: "highly rated",
    DEFAULT: ""
}

export const tagColor = {
    NEW_ARRIVAL: "green",
    FLASH_SALE: "red",
    PROMOTION: "blue",
    BEST_SELLER: "gold", 
    DISCOUNTED: "purple", 
    TRENDING: "orange", 
    PRE_ORDER: "teal",
    FREE_SHIPPING: "cyan",
    GIFT_IDEAS: "pink", 
    CUSTOMER_FAVORITE: "lime",
    HIGHLY_RATED: "darkblue",
    DEFAULT: "gray"
};
 

export const tagKeyLookup = Object.fromEntries(
    Object.entries(tagColorKey).map(([key, value]) => [value, key])
);