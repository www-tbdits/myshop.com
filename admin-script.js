let products = JSON.parse(localStorage.getItem('products')) || [];
let editIndex = null;

// Selectors
const productForm = document.getElementById('productForm');
const btnHome = document.getElementById('btnHome');
const btnPreview = document.getElementById('btnPreview');
const logoutBtn = document.getElementById('btnLogout');
const submitBtn = document.getElementById('submitBtn');
const formTitle = document.getElementById('formTitle');
const imagePreview = document.getElementById('imagePreview');

// Navigation
btnHome.addEventListener('click', () => switchSection('home'));
btnPreview.addEventListener('click', () => switchSection('preview'));
logoutBtn.addEventListener('click', () => {
    if(confirm("Are you sure you want to logout?")) {
        window.location.href = "login.html"; // অথবা আপনার লগইন পেজের নাম
    }
});

function switchSection(section) {
    if(section === 'home') {
        document.getElementById('homeSection').style.display = 'block';
        document.getElementById('previewSection').style.display = 'none';
        btnHome.classList.add('active');
        btnPreview.classList.remove('active');
        if(editIndex === null) clearForm();
    } else {
        document.getElementById('homeSection').style.display = 'none';
        document.getElementById('previewSection').style.display = 'block';
        btnPreview.classList.add('active');
        btnHome.classList.remove('active');
        renderProducts();
    }
}

// Handle Currency Change
document.getElementById('currency').addEventListener('change', (e) => {
    document.getElementById('currencyBox').innerText = e.target.value;
});

// Image Upload Preview
document.getElementById('imageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            document.getElementById('image').value = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Form Submit (Add/Update)
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        currency: document.getElementById('currency').value,
        image: document.getElementById('image').value
    };

    if(editIndex === null) {
        products.push(productData);
        alert("Product Added Successfully!");
    } else {
        products[editIndex] = productData;
        editIndex = null;
        alert("Product Updated Successfully!");
    }

    localStorage.setItem('products', JSON.stringify(products));
    clearForm();
    switchSection('preview');
});

function renderProducts() {
    const list = document.getElementById('productList');
    list.innerHTML = products.length ? '' : '<p>No products found.</p>';

    products.forEach((p, i) => {
        list.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" onerror="this.src='https://via.placeholder.com/150'">
                <h4>${p.name}</h4>
                <p class="price-tag">${p.currency}${p.price}</p>
                <div class="action-btns">
                    <button class="edit-btn" onclick="startEdit(${i})">Edit</button>
                    <button class="delete-btn" onclick="deleteProduct(${i})">Delete</button>
                </div>
            </div>
        `;
    });
}

window.startEdit = (index) => {
    const p = products[index];
    editIndex = index;
    
    document.getElementById('name').value = p.name;
    document.getElementById('description').value = p.description;
    document.getElementById('price').value = p.price;
    document.getElementById('currency').value = p.currency;
    document.getElementById('currencyBox').innerText = p.currency;
    document.getElementById('image').value = p.image;
    imagePreview.src = p.image;
    imagePreview.style.display = 'block';

    formTitle.innerText = "Edit Product";
    submitBtn.innerText = "Update Product";
    submitBtn.style.background = "var(--success)";
    switchSection('home');
};

window.deleteProduct = (index) => {
    if(confirm("Delete this product?")) {
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
    }
};

function clearForm() {
    productForm.reset();
    editIndex = null;
    formTitle.innerText = "Add New Product";
    submitBtn.innerText = "Add Product";
    submitBtn.style.background = "var(--primary)";
    imagePreview.style.display = 'none';
    document.getElementById('currencyBox').innerText = "$";
}
