// admin-script.js

let products = JSON.parse(localStorage.getItem('products')) || [];

// DOM Elements
const btnHome = document.getElementById('btnHome');
const btnPreview = document.getElementById('btnPreview');
const homeSection = document.getElementById('homeSection');
const previewSection = document.getElementById('previewSection');
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

const currencySelect = document.getElementById('currency');
const currencyBox = document.getElementById('currencyBox');

let editIndex = null; // কোন প্রোডাক্ট এডিট হচ্ছে সেটার index

// Initial render
renderProducts();

// Show Home / Preview sections
btnHome.addEventListener('click', () => {
  btnHome.classList.add('active');
  btnPreview.classList.remove('active');
  homeSection.style.display = 'block';
  previewSection.style.display = 'none';
  clearForm();
});

btnPreview.addEventListener('click', () => {
  btnPreview.classList.add('active');
  btnHome.classList.remove('active');
  previewSection.style.display = 'block';
  homeSection.style.display = 'none';
  renderProducts();
});

// Update currency symbol on change
currencySelect.addEventListener('change', () => {
  currencyBox.innerText = currencySelect.value;
});

// Form submit handler (Add or Edit)
productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const description = document.getElementById('description').value.trim();
  const price = document.getElementById('price').value.trim();
  const currency = currencySelect.value;
  const image = document.getElementById('image').value.trim();

  if(!name || !description || !price || !image) {
    alert('Please fill all fields');
    return;
  }

  if(editIndex === null) {
    // Add new product
    products.push({ name, description, price, currency, image });
  } else {
    // Edit existing product
    products[editIndex] = { name, description, price, currency, image };
    editIndex = null;
    productForm.querySelector('button[type="submit"]').innerText = 'Add Product';
  }

  localStorage.setItem('products', JSON.stringify(products));
  alert('Product saved!');
  productForm.reset();
  currencyBox.innerText = '$';
  btnPreview.click(); // Switch to preview
});

// Render products with edit and delete buttons
function renderProducts() {
  productList.innerHTML = '';

  if(products.length === 0) {
    productList.innerHTML = '<p>No products added yet.</p>';
    return;
  }

  products.forEach((product, index) => {
    const div = document.createElement('div');
    div.classList.add('product-card');
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h4>${product.name}</h4>
      <p>${product.description}</p>
      <p class="price">${product.currency}${parseFloat(product.price).toFixed(2)}</p>
      <button class="edit-btn" data-index="${index}">Edit</button>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;

    productList.appendChild(div);
  });

  // Add event listeners for edit and delete buttons
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const i = e.target.dataset.index;
      startEditProduct(i);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const i = e.target.dataset.index;
      deleteProduct(i);
    });
  });
}

function startEditProduct(index) {
  const product = products[index];
  document.getElementById('name').value = product.name;
  document.getElementById('description').value = product.description;
  document.getElementById('price').value = product.price;
  currencySelect.value = product.currency;
  currencyBox.innerText = product.currency;
  document.getElementById('image').value = product.image;

  editIndex = index;
  btnHome.click(); // Switch to form view
  productForm.querySelector('button[type="submit"]').innerText = 'Save Changes';
}

function deleteProduct(index) {
  if(confirm('Are you sure you want to delete this product?')) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
  }
}

function clearForm() {
  productForm.reset();
  currencyBox.innerText = '$';
  editIndex = null;
  productForm.querySelector('button[type="submit"]').innerText = 'Add Product';
}

const imageInput = document.getElementById('image');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');

imageUpload.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview.src = e.target.result;  // লোকাল ডাটা URL
      imagePreview.style.display = 'block';
      imageInput.value = e.target.result;  // আপলোড করলে image input-এ সেট করে দাও
    };
    reader.readAsDataURL(file);
  }
});
