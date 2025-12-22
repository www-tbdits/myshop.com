let lastScrollTop = 0;
const mainHeader = document.querySelector('.main-header');
const subHeader = document.querySelector('.sub-header');

window.addEventListener('scroll', () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // নিচে স্ক্রল করলে লুকাও
    mainHeader.classList.add('hide');
    subHeader.classList.add('hide');
  } else {
    // উপরে স্ক্রল করলে দেখাও
    mainHeader.classList.remove('hide');
    subHeader.classList.remove('hide');
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});


// ========== LOCATION ==========
function openLocationPopup() {
  document.getElementById("locationModal").style.display = "flex";
}

function closeLocationPopup() {
  document.getElementById("locationModal").style.display = "none";
}

function applyLocation() {
  countryText.innerText = countrySelect.value;
  closeLocationPopup();
}

// ========== SEARCH ==========
function doSearch() {
  alert("Search: " + searchInput.value);
}

// ========== LANGUAGE TRANSLATION (GLOBAL) ==========
const langData = {
  en: {
    deliver: "Deliver to",
    signin: "Hello, sign in",
    account: "Account",
    search: "Search Amazon",
    featured: "Featured Products"
  },
  bn: {
    deliver: "ডেলিভারি",
    signin: "সাইন ইন করুন",
    account: "অ্যাকাউন্ট",
    search: "খুঁজুন",
    featured: "ফিচার্ড পণ্য"
  },
  hi: {
    deliver: "डिलीवरी",
    signin: "साइन इन",
    account: "खाता",
    search: "खोजें",
    featured: "उत्पाद"
  },
  fr: {
    deliver: "Livrer à",
    signin: "Connexion",
    account: "Compte",
    search: "Rechercher",
    featured: "Produits"
  },
  es: {
    deliver: "Entregar a",
    signin: "Iniciar sesión",
    account: "Cuenta",
    search: "Buscar",
    featured: "Productos"
  },
  ar: {
    deliver: "التوصيل",
    signin: "تسجيل الدخول",
    account: "الحساب",
    search: "بحث",
    featured: "منتجات"
  },
  de: {
    deliver: "Liefern nach",
    signin: "Anmelden",
    account: "Konto",
    search: "Suchen",
    featured: "Produkte"
  },
  ur: {
    deliver: "ڈیلیوری",
    signin: "سائن ان",
    account: "اکاؤنٹ",
    search: "تلاش",
    featured: "مصنوعات"
  }
};

function changeLanguage(l) {
  document.querySelectorAll("[data-key]").forEach(el => {
    el.innerText = langData[l][el.dataset.key];
  });

  document.querySelectorAll("[data-key-placeholder]").forEach(el => {
    el.placeholder = langData[l][el.dataset.keyPlaceholder];
  });
}

// ========== Sign up  ==========

function openAuth() {
  document.getElementById("authModal").style.display = "flex";
  showLogin();
}

function closeAuth() {
  document.getElementById("authModal").style.display = "none";
}

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

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    alert("Invalid email or password");
    return;
  }

  // Login সফল হলে নাম save করো
  localStorage.setItem("loggedInUser", user.name);

  updateAccountHeader();  // header update করো
  closeAuth();  // login popup বন্ধ করো
}

// header update করার জন্য ফাংশন
function updateAccountHeader() {
  const loggedInName = localStorage.getItem("loggedInUser");
  const accountSmall = document.getElementById("accountSmall");
  const accountName = document.getElementById("accountName");

  if (loggedInName) {
    accountSmall.innerText = "Hello,";
    accountName.innerText = loggedInName;
  } else {
    accountSmall.innerText = "Hello, sign in";
    accountName.innerText = "Account";
  }
}

// পেজ লোড হলে header আপডেট হবে
window.addEventListener("load", updateAccountHeader);


// ========== DEMO ==========

function openOrders() {
  alert("Orders Demo");
}


/* ====== LOCATION POPUP DESIGN ====== */
function openLocationPopup() {
  document.getElementById("locationModal").style.display = "flex";
}

function closeLocationPopup() {
  document.getElementById("locationModal").style.display = "none";
}

function applyLocation() {
  const countrySelect = document.getElementById("countrySelect");
  const countryText = document.getElementById("countryText");

  countryText.innerText = countrySelect.value;
  closeLocationPopup();
}


/* ====== Products ====== */
window.addEventListener('load', () => {
  const productsData = localStorage.getItem('products');
  if(productsData){
    const products = JSON.parse(productsData);
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = ''; // আগে যা ছিল মুছে ফেলো

    products.forEach(product => {
      const div = document.createElement('div');
      div.classList.add('product');
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h4>${product.name}</h4>
        <p>${product.currency}${parseFloat(product.price).toFixed(2)}</p>
        <a href="#" class="btn">Add to Cart</a>
      `;
      productGrid.appendChild(div);
    });
  }
});
