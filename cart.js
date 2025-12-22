let products = [];
let cart = [];

const cartCount = document.getElementById('cartCount');
const cartPreview = document.getElementById('cartPreview');
const cartItems = document.getElementById('cartItems');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  } else {
    cart = [];
  }
}

function updateCartCount() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQty;
  if (totalQty > 0) {
    cartCount.style.display = 'inline-block';
  } else {
    cartCount.style.display = 'none';
  }
}

function addToCart(prodId) {
  const product = products.find(p => p.id === prodId);
  if (!product) return;

  const cartItem = cart.find(item => item.id === prodId);
  if (cartItem) {
    // Already in cart, নতুন করে যোগ করা যাবে না
    return;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCartCount();
  updateAddToCartButtons();

  if (cartPreview.style.display === 'block') {
    openCart();
  }
}

function toggleCart() {
  if (cartPreview.style.display === 'block') {
    cartPreview.style.display = 'none';
  } else {
    openCart();
  }
}

function openCart() {
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cart.forEach(item => {
      const totalPrice = item.price * item.quantity;
      const imgSrc = item.image ? item.image : 'default-image.jpg'; // ছবি

      cartItems.innerHTML += `
        <div class="cart-item" data-id="${item.id}">
          <img src="${imgSrc}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div>Price: ${item.currency || '৳'}${parseFloat(item.price).toFixed(2)}</div>
            <div>Subtotal: ${item.currency || '৳'}${totalPrice.toFixed(2)}</div>
            <div class="cart-item-qty">
              <button onclick="changeQuantity('${item.id}', -1)">−</button>
              <span>${item.quantity}</span>
              <button onclick="changeQuantity('${item.id}', 1)">＋</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">×</button>
        </div>
      `;
    });
  }

  cartPreview.style.display = 'block';
  updateCartCount();
}


function changeQuantity(prodId, delta) {
  const cartItem = cart.find(item => item.id === prodId);
  if (!cartItem) return;

  cartItem.quantity += delta;
  if (cartItem.quantity < 1) {
    removeFromCart(prodId);
  } else {
    saveCart();
    openCart();
  }
}

function removeFromCart(prodId) {
  cart = cart.filter(item => item.id !== prodId);
  saveCart();
  updateCartCount();
  updateAddToCartButtons();

  if (cartPreview.style.display === 'block') {
    openCart();
  }
}


function loadProducts() {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;

  productGrid.innerHTML = '';

  products.forEach((product, index) => {
    if (!product.id) {
      product.id = `p${index + 1}`;
    }

    const imgSrc = product.image ? product.image : 'default-image.jpg';

    const div = document.createElement('div');
    div.classList.add('product-card');
    div.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" style="max-width: 100%; height: auto; display: block; margin-bottom: 8px;">
      <h4>${product.name}</h4>
      <p>${product.currency || '৳'}${parseFloat(product.price).toFixed(2)}</p>
      <button onclick="addToCart('${product.id}')">Add to Cart</button>
    `;
    productGrid.appendChild(div);
  });

  updateAddToCartButtons(); // প্রোডাক্ট লোড করার পরে বাটন আপডেট করবো
}

function updateAddToCartButtons() {
  // প্রথমে কার্টে থাকা প্রোডাক্টগুলোর বাটন disabled করবো
  cart.forEach(item => {
    const btn = document.querySelector(`button[onclick="addToCart('${item.id}')"]`);
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Added';
      btn.style.backgroundColor = '#888';
      btn.style.cursor = 'not-allowed';
    }
  });

  // কার্টে না থাকা প্রোডাক্টগুলোর বাটন active করবো
  products.forEach(product => {
    const btn = document.querySelector(`button[onclick="addToCart('${product.id}')"]`);
    if (btn && !cart.find(item => item.id === product.id)) {
      btn.disabled = false;
      btn.textContent = 'Add to Cart';
      btn.style.backgroundColor = '#007BFF';
      btn.style.cursor = 'pointer';
    }
  });
}

window.onload = function () {
  products = JSON.parse(localStorage.getItem('products')) || [];

  // id না থাকলে id যোগ করো (spread operator দিয়ে সঠিক ক্রমে)
  products = products.map((product, index) => ({
    ...product,
    id: product.id || `p${index + 1}`
  }));

  loadCart();
  loadProducts();
  updateCartCount();
  updateAddToCartButtons();

  console.log('Products Loaded:', products);
  console.log('Cart Loaded:', cart);
};

document.addEventListener('DOMContentLoaded', () => {

  window.openCheckout = function () {
    if (!cart || cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    // Cart preview hide করো
    const cartPreview = document.getElementById('cartPreview');
    cartPreview.style.display = 'none';

    // Checkout modal দেখাও
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'flex';

    loadOrderSummary();
  };

  window.closeCheckout = function () {
    document.getElementById('checkoutModal').style.display = 'none';
  };

  function loadOrderSummary() {
    const box = document.getElementById('orderItems');
    const totalBox = document.getElementById('orderTotal');

    box.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      const imgSrc = item.image ? item.image : 'default-image.jpg'; // ছবি
      const currency = item.currency || '৳'; // currency সিম্বল, ডিফল্ট ৳

      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.marginBottom = '10px';

      row.innerHTML = `
        <img src="${imgSrc}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 10px;">
        <div>
          <div>${item.name} × ${item.quantity}</div>
          <div>Subtotal: ${currency}${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      `;

      box.appendChild(row);
      subtotal += item.price * item.quantity;
    });

    const deliveryCharge = 80;
    const total = subtotal + deliveryCharge;

    // subtotal এর কারেন্সি সিম্বল দেখানোর জন্য প্রথম প্রোডাক্ট এর currency ইউজ করবো, নাহলে ডিফল্ট
    const firstCurrency = cart.length > 0 ? (cart[0].currency || '৳') : '৳';

    totalBox.textContent = `${firstCurrency}${total.toFixed(2)}`; // ডেলিভারি চার্জ সহ মোট
  }

  document.getElementById('checkoutForm').addEventListener('submit', e => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    // Cart preview hide করো
    document.getElementById('cartPreview').style.display = 'none';

    // Checkout modal বন্ধ করো
    closeCheckout();

    // সুন্দর কাস্টম অর্ডার কনফার্মেশন দেখাও
    showOrderConfirmation();

    // কার্ট খালি করো
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
  });

  function showOrderConfirmation() {
  // ১. আগের কোনো মোডাল থাকলে সরিয়ে ফেলা
  let existing = document.getElementById('orderConfirmModal');
  if (existing) existing.remove();

  // ২. আইডি এবং পিন জেনারেট করা
  const orderId = 'ORD-' + Date.now();
  const deliveryPin = Math.floor(1000 + Math.random() * 9000);
  
  // ৩. হিসাব নিকাশ
  const firstCurrency = cart.length > 0 ? (cart[0].currency || '$') : '$';
  let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // আপনি চাইলে এখানে ডেলিভারি চার্জ যোগ করতে পারেন, অথবা শুধু সাবটোটাল দেখাতে পারেন
  const totalAmount = subtotal; 

  const modal = document.createElement('div');
  modal.id = 'orderConfirmModal';
  
  // ব্যাকগ্রাউন্ড স্টাইল
  Object.assign(modal.style, {
    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
    alignItems: 'center', zIndex: '100000', fontFamily: 'sans-serif'
  });

  // ৪. আপনার দেওয়া ফরম্যাট অনুযায়ী ডিজাইন
  modal.innerHTML = `
    <div style="background:white; padding:30px; border-radius:15px; max-width:400px; width:90%; text-align:center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
      <div style="font-size: 50px; margin-bottom: 10px;">✔️</div>
      <h2 style="margin: 0; color: #333;">Congratulations!</h2>
      <h3 style="margin: 5px 0 20px; color: #276749;">Order Placed Successfully!</h3>
      
      <p style="font-size: 14px; color: #555; margin-bottom: 15px;">
        <strong>Your Order ID:</strong> ${orderId}
      </p>

      <div style="text-align: left; background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #eee;">
        <h4 style="margin: 0 0 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Summary:</h4>
        
        <div style="max-height: 120px; overflow-y: auto;">
          ${cart.map(item => `
            <div style="display:flex; justify-content:space-between; font-size: 14px; margin-bottom: 8px;">
              <span>${item.name} × ${item.quantity}</span>
              <span>${firstCurrency}${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        
        <div style="border-top: 2px solid #276749; margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between; font-weight: bold;">
          <span>Total:</span>
          <span>${firstCurrency}${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <p style="font-size: 12px; color: #777; line-height: 1.4; margin-bottom: 10px;">
        Please take a screenshot of this order and show it to the delivery person.
      </p>
      
      <p style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 25px;">
        Your delivery PIN: <span style="color: #d60000;">${deliveryPin}</span>
      </p>
      
      <button id="closeOrderConfirm" style="background:#276749; color:white; border:none; padding:12px 40px; border-radius:8px; cursor:pointer; font-size: 16px; font-weight: bold; width: 100%;">Close</button>
    </div>
  `;

  document.body.appendChild(modal);

  // Close বাটন ইভেন্ট
  document.getElementById('closeOrderConfirm').addEventListener('click', () => {
    modal.remove();
    // কার্ট ক্লিয়ার করা
    cart = [];
    localStorage.removeItem('cart');
    if (typeof updateCartCount === "function") updateCartCount();
    window.location.reload(); 
  });
}

  // PIN generate function (random 4 digit number)
  function generatePin() {
    return Math.floor(1000 + Math.random() * 9000);
  }
});
