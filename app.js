// Nova Store – simple static shop (no backend). Cart is kept in localStorage.
const PRODUCTS = [
  { id: "p1", name: "Wireless Headphones", category: "Audio",       price: 129.0, icon: "🎧", color: "#3b2f7a", desc: "Noise cancelling, 30h battery." },
  { id: "p2", name: "Smart Watch",         category: "Wearables",   price: 199.0, icon: "⌚", color: "#1f4f5c", desc: "Fitness tracking and notifications." },
  { id: "p3", name: "Mechanical Keyboard", category: "Accessories", price: 89.0,  icon: "⌨️", color: "#4a2b4f", desc: "Hot-swappable, RGB backlight." },
  { id: "p4", name: "Portable Speaker",    category: "Audio",       price: 59.0,  icon: "🔊", color: "#2b4a3a", desc: "Waterproof, deep bass." },
  { id: "p5", name: "Instant Camera",      category: "Photo",       price: 149.0, icon: "📷", color: "#5c3a1f", desc: "Print your moments instantly." },
  { id: "p6", name: "Desk Lamp",           category: "Home",        price: 39.0,  icon: "💡", color: "#4f4a1f", desc: "Dimmable LED, USB-C charging." },
  { id: "p7", name: "Backpack",            category: "Travel",      price: 79.0,  icon: "🎒", color: "#1f3a5c", desc: "Laptop sleeve, 22L capacity." },
  { id: "p8", name: "Coffee Mug",          category: "Home",        price: 19.0,  icon: "☕", color: "#3a2b1f", desc: "Ceramic, keeps drinks warm." },
];

const CART_KEY = "nova-cart";
const fmt = (n) => "$" + n.toFixed(2);
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const bg = (c) => `linear-gradient(135deg, ${c}, #181b22)`;

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch { return {}; }
}
function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* ignore */ }
  updateBadge(cart, true);
}
function countItems(cart) {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function updateBadge(cart, animate) {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  badge.textContent = countItems(cart);
  if (animate) {
    badge.classList.remove("bump");
    void badge.offsetWidth;
    badge.classList.add("bump");
  }
}

let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
}

/* ---------- Products page ---------- */
function renderProducts(filter = "") {
  const list = document.getElementById("product-list");
  const q = filter.trim().toLowerCase();
  const items = PRODUCTS.filter((p) => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));

  list.innerHTML = items.map((p) => `
    <article class="card" id="product-${p.id}" data-testid="product-card" data-product-id="${p.id}">
      <div class="card-img" style="background:${bg(p.color)}">${p.icon}</div>
      <div class="card-body">
        <span class="card-cat">${p.category}</span>
        <h3 class="card-title" data-testid="product-name">${p.name}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="card-footer">
          <span class="price" data-testid="product-price">${fmt(p.price)}</span>
          <button class="btn primary" id="add-${p.id}" data-testid="add-to-cart" data-product-id="${p.id}">Add to cart</button>
        </div>
      </div>
    </article>`).join("");

  document.getElementById("no-results").classList.toggle("hidden", items.length > 0);
}

function initProducts() {
  renderProducts();
  document.getElementById("search").addEventListener("input", (e) => renderProducts(e.target.value));
  document.getElementById("product-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-testid='add-to-cart']");
    if (!btn) return;
    const id = btn.dataset.productId;
    const cart = loadCart();
    cart[id] = (cart[id] || 0) + 1;
    saveCart(cart);
    toast(`${byId(id).name} added to cart`);
  });
}

/* ---------- Cart page ---------- */
function renderCart() {
  const cart = loadCart();
  const container = document.getElementById("cart-items");
  const entries = Object.entries(cart).filter(([id, q]) => byId(id) && q > 0);
  const empty = entries.length === 0;

  document.querySelector(".cart-layout").classList.toggle("hidden", empty);
  document.getElementById("empty-cart").classList.toggle("hidden", !empty);

  container.innerHTML = entries.map(([id, qty]) => {
    const p = byId(id);
    return `
      <div class="cart-item" id="cart-item-${id}" data-testid="cart-item" data-product-id="${id}">
        <div class="cart-thumb" style="background:${bg(p.color)}">${p.icon}</div>
        <div>
          <div class="item-name" data-testid="cart-item-name">${p.name}</div>
          <div class="item-price" data-testid="cart-item-price">${fmt(p.price)} each</div>
          <button class="remove-btn" id="remove-${id}" data-testid="remove-item" data-action="remove" data-product-id="${id}">Remove</button>
        </div>
        <div class="qty">
          <button class="icon-btn" id="decrease-${id}" data-testid="qty-decrease" data-action="dec" data-product-id="${id}" aria-label="Decrease quantity">−</button>
          <span class="qty-value" id="qty-${id}" data-testid="cart-item-qty">${qty}</span>
          <button class="icon-btn" id="increase-${id}" data-testid="qty-increase" data-action="inc" data-product-id="${id}" aria-label="Increase quantity">+</button>
        </div>
        <div class="line-total" id="line-total-${id}" data-testid="cart-item-total">${fmt(p.price * qty)}</div>
      </div>`;
  }).join("");

  const subtotal = entries.reduce((s, [id, q]) => s + byId(id).price * q, 0);
  document.getElementById("summary-items").textContent = countItems(cart);
  document.getElementById("summary-subtotal").textContent = fmt(subtotal);
  document.getElementById("summary-total").textContent = fmt(subtotal);
}

function initCart() {
  renderCart();

  document.getElementById("cart-items").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = btn.dataset.productId;
    const cart = loadCart();
    if (btn.dataset.action === "inc") cart[id]++;
    if (btn.dataset.action === "dec") cart[id]--;
    if (btn.dataset.action === "remove" || cart[id] <= 0) {
      delete cart[id];
      toast(`${byId(id).name} removed`);
    }
    saveCart(cart);
    renderCart();
  });

  document.getElementById("clear-cart-btn").addEventListener("click", () => {
    saveCart({});
    renderCart();
    toast("Cart cleared");
  });

  document.getElementById("checkout-btn").addEventListener("click", () => {
    const orderNo = "NS-" + Date.now().toString().slice(-6);
    saveCart({});
    document.querySelector(".cart-layout").classList.add("hidden");
    document.getElementById("empty-cart").classList.add("hidden");
    document.getElementById("order-success").classList.remove("hidden");
    document.getElementById("order-number").textContent = orderNo;
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // Open any page with ?reset to start from an empty cart (useful for test isolation).
  if (new URLSearchParams(location.search).has("reset")) {
    try { localStorage.removeItem(CART_KEY); } catch { /* ignore */ }
  }
  updateBadge(loadCart(), false);
  const page = document.body.dataset.page;
  if (page === "products") initProducts();
  if (page === "cart") initCart();
});
