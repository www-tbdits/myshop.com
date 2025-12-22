/**
 * ==========================================================================
 * 1. HEADER SCROLL & GLOBAL SETUP
 * ==========================================================================
 */
const mainHeader = document.querySelector('.main-header');
const subHeader = document.querySelector('.sub-header');
let lastScrollTop = 0;

window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 50) {
        mainHeader.classList.add("hide");
        subHeader.classList.add("hide");
    } else {
        mainHeader.classList.remove("hide");
        subHeader.classList.remove("hide");
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

/**
 * ==========================================================================
 * 2. LOCATION FUNCTIONS
 * ==========================================================================
 */
function openLocationPopup() {
    document.getElementById("locationModal").style.display = "flex";
}

function closeLocationPopup() {
    document.getElementById("locationModal").style.display = "none";
}

function applyLocation() {
    const countrySelect = document.getElementById("countrySelect");
    const countryText = document.getElementById("countryText");
    
    if (countrySelect && countryText) {
        countryText.innerText = countrySelect.value;
        localStorage.setItem("userLocation", countrySelect.value); // লোকেশন সেভ রাখার জন্য
    }
    closeLocationPopup();
}

/**
 * ==========================================================================
 * AUTHENTICATION & LOGOUT (WITH ENTER KEY & CLOSE LOGIC)
 * ==========================================================================
 */

// অ্যাকাউন্ট সেকশনে ক্লিক করলে যা হবে
function openAuth() {
    const loggedInName = localStorage.getItem("loggedInUser");
    if (loggedInName) {
        if (confirm(`Hi ${loggedInName}, do you want to logout?`)) {
            logoutUser();
        }
    } else {
        document.getElementById("authModal").style.display = "flex";
        showLogin();
    }
}

function closeAuth() {
    document.getElementById("authModal").style.display = "none";
}

// লগইন বক্সে এন্টার বাটন সেটআপ
document.getElementById("loginBox").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        loginUser();
    }
});

// সাইনআপ বক্সে এন্টার বাটন সেটআপ
document.getElementById("signupBox").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        signupUser();
    }
});

function showSignup() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("signupBox").style.display = "block";
}

function showLogin() {
    document.getElementById("signupBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
}

function signupUser() {
    const name = document.getElementById('suName').value.trim();
    const email = document.getElementById('suEmail').value.trim();
    const password = document.getElementById('suPassword').value.trim();

    if (!name || !email || !password) {
        alert("All fields are required");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.email === email)) {
        alert("User already exists");
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful. Please login.");
    showLogin();
}

function loginUser() {
    const email = document.getElementById('liEmail').value.trim();
    const password = document.getElementById('liPassword').value.trim();
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        alert("Invalid email or password");
        return;
    }

    localStorage.setItem("loggedInUser", user.name);
    updateAccountHeader();
    closeAuth();
}

function logoutUser() {
    localStorage.removeItem("loggedInUser");
    updateAccountHeader();
    alert("Logged out successfully!");
    location.reload();
}

function updateAccountHeader() {
    const loggedInName = localStorage.getItem("loggedInUser");
    const accountSmall = document.getElementById("accountSmall");
    const accountName = document.getElementById("accountName");

    if (loggedInName) {
        if (accountSmall) accountSmall.innerText = "Hello,";
        if (accountName) accountName.innerText = loggedInName;
    } else {
        if (accountSmall) accountSmall.innerText = "Hello, sign in";
        if (accountName) accountName.innerText = "Account";
    }
}

// পেজ লোড হলে হেডার আপডেট
window.addEventListener("load", updateAccountHeader);

/**
 * ==========================================================================
 * 4. SEARCH & PRODUCT LOGIC
 * ==========================================================================
 */
function displayProducts(productsList) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = ''; 

    productsList.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('product');
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p>${product.currency}${parseFloat(product.price).toFixed(2)}</p>
            <button class="btn" onclick="addToCartByName('${product.name}')">Add to Cart</button>
        `;
        productGrid.appendChild(div);
    });
}

function addToCartByName(productName) {
    const productsData = JSON.parse(localStorage.getItem('products')) || [];
    const productToAdd = productsData.find(p => p.name === productName);

    if (productToAdd) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(productToAdd);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(productName + " added to cart!");
    }
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cartCount'); 
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }
}

function doSearch() {
    const inputField = document.getElementById("searchInput");
    const searchTerm = inputField.value.toLowerCase().trim();
    const productsData = localStorage.getItem('products');

    if (searchTerm === "") {
        alert("Please type something to search!");
        return;
    }

    if (productsData) {
        const products = JSON.parse(productsData);
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );

        if (filteredProducts.length > 0) {
            displayProducts(filteredProducts); 
        } else {
            alert("Sorry, no products were found!");
        }
    }
}

/**
 * ==========================================================================
 * 5. INITIALIZATION
 * ==========================================================================
 */
document.getElementById("searchInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        doSearch();
    }
});

window.addEventListener('load', () => {
    updateCartCount();
    updateAccountHeader();
    
    // লোকেশন রিস্টোর
    const savedLoc = localStorage.getItem("userLocation");
    if (savedLoc) {
        const countryText = document.getElementById("countryText");
        if (countryText) countryText.innerText = savedLoc;
    }

    const productsData = localStorage.getItem('products');
    if (productsData) {
        displayProducts(JSON.parse(productsData));
    }
});

function openOrders() {
    alert("Orders Demo History");
}
