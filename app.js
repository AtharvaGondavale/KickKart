// Basic product catalog shared across pages
const KK_PRODUCTS = [
  {
    id: "boot-phantom-speed",
    name: "Phantom Speed Pro FG Boots",
    category: "boots",
    price: 129.99,
    image: "Phantom Speed Pro FG Boots.webp",
    rating: 4.9,
    reviews: 312,
    tag: "Player Favorite",
    sizeLabel: "EU 40–45",
    bestSeller: true,
  },
  {
    id: "boot-mercurial-elite",
    name: "Mercurial Elite Vapor Boots",
    category: "boots",
    price: 149.99,
    image: "Mercurial Elite Vapor Boots.jpg",
    rating: 4.8,
    reviews: 245,
    tag: "For Wingers",
    sizeLabel: "EU 39–44",
    bestSeller: true,
  },
  {
    id: "boot-pitch-control",
    name: "PitchControl Hybrid Studs",
    category: "boots",
    price: 94.5,
    image: "PitchControl Hybrid Studs.jpg",
    rating: 4.6,
    reviews: 168,
    tag: "All Grounds",
    sizeLabel: "EU 38–44",
    bestSeller: false,
  },
  {
    id: "jersey-home-elite",
    name: "Elite Home Match Jersey",
    category: "jerseys",
    price: 79.99,
    image: "Elite Home Match Jersey.jpg",
    rating: 4.7,
    reviews: 210,
    tag: "Breathable",
    sizeLabel: "S–XL",
    bestSeller: true,
  },
  {
    id: "jersey-away-classic",
    name: "Classic Away Jersey",
    category: "jerseys",
    price: 69.99,
    image: "Classic Away Jersey.webp",
    rating: 4.5,
    reviews: 133,
    tag: "Lightweight",
    sizeLabel: "S–XXL",
    bestSeller: false,
  },
  {
    id: "kit-goalkeeper",
    name: "Pro Goalkeeper Jersey & Shorts",
    category: "jerseys",
    price: 99.99,
    image: "Pro Goalkeeper Jersey & Shorts.jpg",
    rating: 4.8,
    reviews: 97,
    tag: "Extra Padding",
    sizeLabel: "M–XL",
    bestSeller: true,
  },
  {
    id: "gear-gloves-grip",
    name: "GripLock Match Gloves",
    category: "gear",
    price: 59.99,
    image: "GripLock Match Gloves.jpg",
    rating: 4.9,
    reviews: 188,
    tag: "Keeper's Choice",
    sizeLabel: "Sizes 8–11",
    bestSeller: true,
  },
  {
    id: "gear-shinguards-pro",
    name: "Pro Slim Shin Guards",
    category: "gear",
    price: 34.99,
    image: "Pro Slim Shin Guards.webp",
    rating: 4.6,
    reviews: 154,
    tag: "Low Profile",
    sizeLabel: "Youth & Adult",
    bestSeller: false,
  },
  {
    id: "gear-stockings-grip",
    name: "GripFit Match Stockings",
    category: "gear",
    price: 24.99,
    image: "GripFit Match Stockings.jpg",
    rating: 4.7,
    reviews: 201,
    tag: "Anti-Slip",
    sizeLabel: "All Sizes",
    bestSeller: true,
  },
];

const CART_STORAGE_KEY = "kickkart_cart_v1";

function kkLoadCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function kkSaveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // ignore
  }
}

function kkCartTotals(cart) {
  let itemCount = 0;
  let total = 0;
  for (const [id, qty] of Object.entries(cart)) {
    const product = KK_PRODUCTS.find((p) => p.id === id);
    if (!product) continue;
    itemCount += qty;
    total += product.price * qty;
  }
  return { itemCount, total };
}

function kkFormatPrice(value) {
  return value.toFixed(2);
}

/* Cart badge */

function kkUpdateCartBadge() {
  const cart = kkLoadCart();
  const { itemCount } = kkCartTotals(cart);
  const badge = document.getElementById("kk-cart-count");
  if (badge) {
    badge.textContent = String(itemCount);
  }
}

/* Product rendering */

function kkCreateProductCard(product) {
  const card = document.createElement("article");
  card.className = "kk-card kk-product-card";
  card.dataset.productId = product.id;
  card.dataset.category = product.category;

  card.innerHTML = `
    <div class="kk-product-media">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <span class="kk-product-tag">${product.tag}</span>
    </div>
    <div class="kk-product-body">
      <h3 class="kk-product-title">${product.name}</h3>
      <div class="kk-product-meta">
        <span class="kk-product-price">$${kkFormatPrice(product.price)}</span>
        <span class="kk-product-rating">
          ★ ${product.rating.toFixed(1)} · ${product.reviews}
        </span>
      </div>
      <p class="kk-product-desc">
        Match-ready performance gear tested by players and built for 90+ minutes of football.
      </p>
      <div class="kk-product-actions">
        <span class="kk-product-size">${product.sizeLabel}</span>
        <button class="kk-btn kk-btn-primary kk-product-add" data-product-id="${product.id}">
          Add to cart
        </button>
      </div>
    </div>
  `;

  return card;
}

function kkRenderHomeGrids() {
  const grids = document.querySelectorAll(".kk-product-grid[data-product-group]");
  if (!grids.length) return;

  grids.forEach((grid) => {
    const group = grid.getAttribute("data-product-group");
    const products = KK_PRODUCTS.filter((p) => p.category === group).slice(0, 3);
    products.forEach((p) => {
      grid.appendChild(kkCreateProductCard(p));
    });
  });
}

function kkRenderBestSellers() {
  const container = document.getElementById("kk-best-sellers-grid");
  if (!container) return;

  const best = KK_PRODUCTS.filter((p) => p.bestSeller);
  best.forEach((p) => container.appendChild(kkCreateProductCard(p)));

  // Filtering chips
  const chips = document.querySelectorAll(".kk-filters .kk-chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.getAttribute("data-filter");
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");

      Array.from(container.children).forEach((card) => {
        if (!(card instanceof HTMLElement)) return;
        const cat = card.dataset.category;
        const isVisible = filter === "all" || cat === filter;
        card.style.display = isVisible ? "" : "none";
      });
    });
  });
}

/* Cart interactions */

function kkAttachAddToCartHandlers() {
  document.body.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches(".kk-product-add")) {
      const id = target.getAttribute("data-product-id");
      if (!id) return;
      const cart = kkLoadCart();
      cart[id] = (cart[id] || 0) + 1;
      kkSaveCart(cart);
      kkUpdateCartBadge();

      target.textContent = "Added!";
      target.disabled = true;
      setTimeout(() => {
        target.textContent = "Add to cart";
        target.disabled = false;
      }, 700);
    }
  });
}

function kkRenderCart() {
  const list = document.getElementById("kk-cart-items");
  const emptyState = document.getElementById("kk-cart-empty-state");
  const itemsCountEl = document.getElementById("kk-checkout-items-count");
  const totalEl = document.getElementById("kk-checkout-total");
  const subtotalEl = document.getElementById("kk-summary-subtotal");
  const totalSummaryEl = document.getElementById("kk-summary-total");

  if (!list || !emptyState) return;

  const cart = kkLoadCart();
  const entries = Object.entries(cart);

  list.innerHTML = "";

  if (!entries.length) {
    emptyState.classList.remove("kk-hidden");
    if (itemsCountEl) itemsCountEl.textContent = "0 items";
    if (totalEl) totalEl.textContent = "0.00";
    if (subtotalEl) subtotalEl.textContent = "0.00";
    if (totalSummaryEl) totalSummaryEl.textContent = "0.00";
    return;
  }

  emptyState.classList.add("kk-hidden");

  entries.forEach(([id, qty]) => {
    const product = KK_PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    const li = document.createElement("li");
    li.className = "kk-cart-item";
    li.dataset.productId = id;
    li.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="kk-cart-item-main">
        <div class="kk-cart-item-title">${product.name}</div>
        <div class="kk-cart-item-meta">
          <span>${product.category.toUpperCase()}</span>
          <span class="kk-cart-item-price">$${kkFormatPrice(product.price)}</span>
        </div>
        <div class="kk-cart-item-controls">
          <button class="kk-qty-btn" data-action="dec">-</button>
          <span class="kk-qty-value">${qty}</span>
          <button class="kk-qty-btn" data-action="inc">+</button>
          <button class="kk-remove-btn">Remove</button>
        </div>
      </div>
    `;
    list.appendChild(li);
  });

  const { itemCount, total } = kkCartTotals(cart);
  if (itemsCountEl) itemsCountEl.textContent = `${itemCount} item${itemCount === 1 ? "" : "s"}`;
  if (totalEl) totalEl.textContent = kkFormatPrice(total);
  if (subtotalEl) subtotalEl.textContent = kkFormatPrice(total);
  if (totalSummaryEl) totalSummaryEl.textContent = kkFormatPrice(total);

  list.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const itemEl = target.closest(".kk-cart-item");
    if (!itemEl) return;
    const id = itemEl.getAttribute("data-product-id");
    if (!id) return;

    const cartCurrent = kkLoadCart();
    let changed = false;

    if (target.matches(".kk-remove-btn")) {
      delete cartCurrent[id];
      changed = true;
    } else if (target.matches(".kk-qty-btn")) {
      const action = target.getAttribute("data-action");
      const currentQty = cartCurrent[id] || 1;
      if (action === "inc") {
        cartCurrent[id] = currentQty + 1;
        changed = true;
      } else if (action === "dec") {
        if (currentQty <= 1) {
          delete cartCurrent[id];
        } else {
          cartCurrent[id] = currentQty - 1;
        }
        changed = true;
      }
    }

    if (changed) {
      kkSaveCart(cartCurrent);
      kkUpdateCartBadge();
      kkRenderCart();
    }
  });

  const clearBtn = document.getElementById("kk-clear-cart-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      kkSaveCart({});
      kkUpdateCartBadge();
      kkRenderCart();
    });
  }
}

/* Smooth scroll for category chips on home */

function kkAttachScrollChips() {
  const chips = document.querySelectorAll("[data-scroll-target]");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const targetId = chip.getAttribute("data-scroll-target");
      if (!targetId) return;
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

/* Forms: checkout & contact (mock) */

function kkAttachCheckoutForm() {
  const form = document.getElementById("kk-checkout-form");
  const success = document.getElementById("kk-checkout-success");
  const shippingEl = document.getElementById("kk-summary-shipping");
  if (!form) return;

  const cart = kkLoadCart();
  const { total } = kkCartTotals(cart);
  if (shippingEl) {
    if (total >= 80) {
      shippingEl.textContent = "Free";
    } else if (total === 0) {
      shippingEl.textContent = "Add items to see shipping";
    } else {
      shippingEl.textContent = "$6.99";
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (success) {
      success.hidden = false;
    }
  });
}

function kkAttachContactForm() {
  const form = document.getElementById("kk-contact-form");
  const success = document.getElementById("kk-contact-success");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (success) {
      success.hidden = false;
    }
  });
}

/* Cart button navigation */

function kkAttachCartButton() {
  const btn = document.getElementById("kk-cart-button");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (!location.pathname.endsWith("checkout.html")) {
      window.location.href = "checkout.html";
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

/* Initialize */

document.addEventListener("DOMContentLoaded", () => {
  kkUpdateCartBadge();
  kkRenderHomeGrids();
  kkRenderBestSellers();
  kkAttachAddToCartHandlers();
  kkAttachScrollChips();
  kkRenderCart();
  kkAttachCheckoutForm();
  kkAttachContactForm();
  kkAttachCartButton();
});

