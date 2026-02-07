// ==================== YOKER COMMAND SYSTEM & STATE MANAGEMENT ====================

// Product Database
const PRODUCTS = {
    men: [
        {
            id: 'M001',
            name: 'Performance Jacket',
            price: 189,
            category: 'men',
            description: 'Advanced technical jacket engineered for peak performance and precision movement.',
            image: 'linear-gradient(135deg, #1a1a1a, #333)',
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            tags: ['jacket', 'performance', 'tech']
        },
        {
            id: 'M002',
            name: 'Compression Tights',
            price: 129,
            category: 'men',
            description: 'Precision compression mapping for enhanced muscle support and blood flow.',
            image: 'linear-gradient(135deg, #222, #2a2a2a)',
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            tags: ['tights', 'compression', 'performance']
        },
        {
            id: 'M003',
            name: 'Breathable Shirt',
            price: 99,
            category: 'men',
            description: 'Advanced moisture-wicking fiber technology for maximum breathability.',
            image: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            tags: ['shirt', 'breathable', 'tee']
        },
        {
            id: 'M004',
            name: 'Training Gloves',
            price: 79,
            category: 'men',
            description: 'Ergonomic grip enhancement with reinforced palm support.',
            image: 'linear-gradient(135deg, #2a2a2a, #333)',
            sizes: ['S', 'M', 'L', 'XL'],
            tags: ['gloves', 'training', 'grip']
        }
    ],
    women: [
        {
            id: 'W001',
            name: 'Performance Bodysuit',
            price: 219,
            category: 'women',
            description: 'Full-body compression system for maximum athletic performance.',
            image: 'linear-gradient(135deg, #1a1a1a, #333)',
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            tags: ['bodysuit', 'performance', 'compression']
        },
        {
            id: 'W002',
            name: 'Mesh Sports Top',
            price: 139,
            category: 'women',
            description: 'Lightweight mesh construction with seamless design for unrestricted movement.',
            image: 'linear-gradient(135deg, #222, #2a2a2a)',
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            tags: ['top', 'sports', 'mesh']
        },
        {
            id: 'W003',
            name: 'Power Leggings',
            price: 149,
            category: 'women',
            description: 'Strategic compression zones with high-waist support and pocket detail.',
            image: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            tags: ['leggings', 'power', 'compression']
        },
        {
            id: 'W004',
            name: 'Performance Shorts',
            price: 89,
            category: 'women',
            description: 'Lightweight shorts with built-in compression and quick-dry technology.',
            image: 'linear-gradient(135deg, #2a2a2a, #333)',
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            tags: ['shorts', 'performance', 'quick-dry']
        }
    ]
};

// ==================== STATE MANAGEMENT ====================
const STATE = {
    ui: {
        cartOpen: false,
        searchOpen: false,
        productModalOpen: false,
        sizeGuideOpen: false,
        activeSection: 'home',
        transitioning: false,
        hoveredCardId: null
    },
    cart: {
        items: [],
        count: 0,
        total: 0
    },
    search: {
        query: '',
        results: []
    },
    product: {
        current: null,
        selectedSize: null,
        qty: 1
    }
};

/* Background motion settings (live-tunable) */
const BG_MOTION_SETTINGS = {
    densityDivisor: 45000,
    speedScale: 1.25,
    trailAlpha: 0.06
};
const BG_PRESETS = {
    low: { densityDivisor: 90000, speedScale: 0.8, trailAlpha: 0.12 },
    medium: { densityDivisor: 45000, speedScale: 1.25, trailAlpha: 0.06 },
    high: { densityDivisor: 30000, speedScale: 1.6, trailAlpha: 0.04 }
};

// ==================== PERSISTENCE ====================
function loadCart() {
    const saved = localStorage.getItem('yoker_cart');
    if (saved) {
        try {
            STATE.cart = JSON.parse(saved);
            updateCartUI();
        } catch (e) {
            console.error('Failed to load cart:', e);
        }
    }
}

function saveCart() {
    localStorage.setItem('yoker_cart', JSON.stringify(STATE.cart));
}

// ==================== COMMAND FUNCTIONS ====================

// Navigation Commands
function GoHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function Navigate(url) {
    if (url.startsWith('http')) {
        window.open(url, '_blank', 'noopener,noreferrer');
    } else if (url.startsWith('#')) {
        GoToSection(url.slice(1));
    } else {
        window.location.href = url;
    }
}

function GoToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        CloseCart();
        CloseSearchOverlay();
        section.scrollIntoView({ behavior: 'smooth' });
        STATE.ui.activeSection = sectionId;
    }
}

// Search Commands
function OpenSearchOverlay() {
    console.log('OpenSearchOverlay called');
    STATE.ui.searchOpen = true;
    const overlay = document.getElementById('search-overlay');
    const backdrop = document.getElementById('backdrop');
    console.log('Overlay element:', overlay);
    
    if (overlay) {
        overlay.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.getElementById('search-input')?.focus();
        console.log('Search overlay opened');
    } else {
        console.log('ERROR: search-overlay element not found');
    }
}

function CloseSearchOverlay() {
    STATE.ui.searchOpen = false;
    const overlay = document.getElementById('search-overlay');
    const backdrop = document.getElementById('backdrop');
    
    if (overlay) {
        overlay.classList.remove('active');
        if (!STATE.ui.cartOpen) {
            backdrop.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
    STATE.search.query = '';
    STATE.search.results = [];
}

function Search(query) {
    STATE.search.query = query.toLowerCase();
    
    if (query.length < 1) {
        ShowSearchEmpty();
        return;
    }

    const results = [];
    
    // Search all products
    ['men', 'women'].forEach(category => {
        PRODUCTS[category].forEach(product => {
            const matchName = product.name.toLowerCase().includes(STATE.search.query);
            const matchTags = product.tags.some(tag => tag.includes(STATE.search.query));
            
            if (matchName || matchTags) {
                results.push({ ...product, category });
            }
        });
    });

    STATE.search.results = results;
    DisplaySearchResults(results);
}

function ShowSearchEmpty() {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="search-empty">
                <p>No matches. Try: jacket, tee, compression, shorts, performance</p>
            </div>
        `;
    }
}

function DisplaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    if (results.length === 0) {
        ShowSearchEmpty();
        return;
    }

    // Group by category
    const grouped = { men: [], women: [] };
    results.forEach(product => {
        grouped[product.category].push(product);
    });

    let html = '';
    
    if (grouped.men.length > 0) {
        html += `<div class="search-result-group">
            <div class="search-result-label">Men</div>
            ${grouped.men.map(p => `
                <div class="search-result-item" data-command="OpenProduct" data-product-id="${p.id}">
                    <div>
                        <div class="search-result-name">${p.name}</div>
                        <div class="search-result-price">$${p.price.toFixed(2)}</div>
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    if (grouped.women.length > 0) {
        html += `<div class="search-result-group">
            <div class="search-result-label">Women</div>
            ${grouped.women.map(p => `
                <div class="search-result-item" data-command="OpenProduct" data-product-id="${p.id}">
                    <div>
                        <div class="search-result-name">${p.name}</div>
                        <div class="search-result-price">$${p.price.toFixed(2)}</div>
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    resultsContainer.innerHTML = html;
}

// Product Commands
function OpenProduct(productId) {
    let product = null;
    
    for (const category in PRODUCTS) {
        const found = PRODUCTS[category].find(p => p.id === productId);
        if (found) {
            product = found;
            break;
        }
    }

    if (!product) return;

    STATE.product.current = product;
    STATE.product.selectedSize = null;
    STATE.product.qty = 1;

    DisplayProductModal(product);
    CloseSearchOverlay();
}

function DisplayProductModal(product) {
    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('product-detail-content');
    
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
        <div class="product-detail-image" style="background: ${product.image};"></div>
        <div class="product-detail-info">
            <h3>${product.name}</h3>
            <div class="product-detail-price">$${product.price.toFixed(2)}</div>
            <p class="product-detail-desc">${product.description}</p>
            
            <div class="size-selector">
                <label class="size-label">Select Size</label>
                <div class="size-options">
                    ${product.sizes.map(size => `
                        <button class="size-option" data-size="${size}" data-command="SelectSize" data-value="${size}">
                            ${size}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="qty-selector">
                <label class="qty-label">Quantity</label>
                <div class="qty-input-group">
                    <button data-command="SetQty" data-value="minus">−</button>
                    <input type="number" value="${STATE.product.qty}" min="1" readonly>
                    <button data-command="SetQty" data-value="plus">+</button>
                </div>
            </div>

            <div class="product-detail-actions">
                <button class="btn btn-primary" data-command="AddToCart" data-product-id="${product.id}">
                    Add to Cart
                </button>
                <button class="btn btn-secondary" data-command="OpenSizeGuide" data-product-id="${product.id}">
                    Size Guide
                </button>
            </div>
        </div>
    `;

    STATE.ui.productModalOpen = true;
    modal.classList.add('active');
    document.getElementById('backdrop').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function CloseProduct() {
    STATE.ui.productModalOpen = false;
    const modal = document.getElementById('product-modal');
    const backdrop = document.getElementById('backdrop');
    
    if (modal) {
        modal.classList.remove('active');
    }
    
    if (!STATE.ui.cartOpen && !STATE.ui.searchOpen) {
        backdrop.classList.remove('active');
    }
    
    document.body.style.overflow = '';
}

function SelectSize(size) {
    STATE.product.selectedSize = size;
    
    // Update UI
    document.querySelectorAll('.size-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    document.querySelectorAll(`[data-size="${size}"]`).forEach(el => {
        el.classList.add('selected');
    });
}

function SetQty(operation) {
    if (operation === 'plus') {
        STATE.product.qty++;
    } else if (operation === 'minus' && STATE.product.qty > 1) {
        STATE.product.qty--;
    }
    
    // Update UI
    const input = document.querySelector('.qty-input-group input');
    if (input) {
        input.value = STATE.product.qty;
    }
}

function OpenSizeGuide(productId) {
    STATE.ui.sizeGuideOpen = true;
    const modal = document.getElementById('size-guide-modal');
    
    if (modal) {
        modal.classList.add('active');
        document.getElementById('backdrop').classList.add('active');
    }
}

function CloseSizeGuide() {
    STATE.ui.sizeGuideOpen = false;
    const modal = document.getElementById('size-guide-modal');
    
    if (modal) {
        modal.classList.remove('active');
    }
}

// Cart Commands
function OpenCart() {
    console.log('OpenCart called');
    STATE.ui.cartOpen = true;
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('backdrop');
    console.log('Cart drawer:', drawer);
    
    if (drawer && backdrop) {
        drawer.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Cart opened successfully');
    }
}

function CloseCart() {
    STATE.ui.cartOpen = false;
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('backdrop');
    
    if (drawer && backdrop) {
        drawer.classList.remove('active');
        if (!STATE.ui.searchOpen && !STATE.ui.productModalOpen) {
            backdrop.classList.remove('active');
        }
    }
    
    document.body.style.overflow = '';
}

function AddToCart(productId, qty = null, size = null) {
    const currentQty = qty || STATE.product.qty || 1;
    const currentSize = size || STATE.product.selectedSize;
    
    // If size is required and not selected
    if (!currentSize && productId === STATE.product.current?.id) {
        Toast('Please select a size', 'warning');
        document.querySelectorAll('.size-option').forEach(el => {
            el.style.animation = 'shake 0.3s ease-in-out';
        });
        return;
    }

    let product = null;
    for (const category in PRODUCTS) {
        const found = PRODUCTS[category].find(p => p.id === productId);
        if (found) {
            product = found;
            break;
        }
    }

    if (!product) return;

    // Check if item already in cart
    const existingItem = STATE.cart.items.find(
        item => item.id === productId && item.size === currentSize
    );

    if (existingItem) {
        existingItem.qty += currentQty;
    } else {
        STATE.cart.items.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: currentQty,
            size: currentSize,
            category: product.category
        });
    }

    updateCartState();
    saveCart();
    Toast(`✓ Added ${product.name} to cart`, 'success');
    CloseProduct();
}

function RemoveFromCart(lineItemId) {
    STATE.cart.items.splice(lineItemId, 1);
    updateCartState();
    saveCart();
    updateCartUI();
    Toast('Item removed from cart', 'success');
}

function ChangeQty(lineItemId, delta) {
    const item = STATE.cart.items[lineItemId];
    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {
        RemoveFromCart(lineItemId);
        return;
    }

    updateCartState();
    saveCart();
    updateCartUI();
}

function BeginCheckout() {
    if (STATE.cart.count === 0) {
        Toast('Your cart is empty', 'warning');
        return;
    }

    // Simulate checkout
    Toast('Redirecting to checkout...', 'success');
    setTimeout(() => {
        alert('YOKER Checkout\n\nOrder Summary:\n' + 
              STATE.cart.items.map(item => `- ${item.name} (${item.size || 'One size'}) x${item.qty}`).join('\n') +
              `\n\nTotal: $${STATE.cart.total.toFixed(2)}\n\nThank you for choosing YOKER.');
    }, 1000);
}

function FilterCategory(category) {
    GoToSection(category);
}

// Newsletter Command
function SubmitNewsletter(email) {
    if (!email || !email.includes('@')) {
        Toast('Please enter a valid email', 'error');
        return;
    }

    Toast('✓ Welcome to YOKER. Stay in motion.', 'success');
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.reset();
    }
}

// ==================== UTILITY FUNCTIONS ====================
function updateCartState() {
    STATE.cart.count = STATE.cart.items.reduce((sum, item) => sum + item.qty, 0);
    STATE.cart.total = STATE.cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function updateCartUI() {
    updateCartState();
    updateCartBadge();
    displayCartItems();

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = STATE.cart.count === 0;
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        if (STATE.cart.count > 0) {
            badge.classList.add('active');
            badge.textContent = STATE.cart.count;
        } else {
            badge.classList.remove('active');
            badge.textContent = '0';
        }
    }
}

function displayCartItems() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    if (STATE.cart.items.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <p>Your cart is empty.</p>
                <button class="btn btn-small" data-command="GoToSection" data-target="men">Continue Shopping</button>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = STATE.cart.items.map((item, idx) => `
        <div class="cart-item">
            <div class="cart-item-image" style="background: ${item.image};"></div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">${item.size || 'One size'}</div>
                <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" data-command="ChangeQty" data-line-id="${idx}" data-delta="-1">−</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" data-command="ChangeQty" data-line-id="${idx}" data-delta="1">+</button>
                    <button class="cart-item-remove" data-command="RemoveFromCart" data-line-id="${idx}">×</button>
                </div>
            </div>
        </div>
    `).join('');

    const totalEl = document.getElementById('cart-total');
    if (totalEl) {
        totalEl.textContent = `$${STATE.cart.total.toFixed(2)}`;
    }
}

function Toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.role = 'status';
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== WISHLIST (localStorage) ====================
function loadWishlist() {
    const saved = localStorage.getItem('yoker_wishlist');
    if (saved) {
        try {
            STATE.wishlist = JSON.parse(saved);
        } catch (e) {
            STATE.wishlist = [];
        }
    } else {
        STATE.wishlist = [];
    }
    updateWishlistUI();
}

function saveWishlist() {
    localStorage.setItem('yoker_wishlist', JSON.stringify(STATE.wishlist || []));
}

function ToggleWishlist(productId) {
    STATE.wishlist = STATE.wishlist || [];
    const idx = STATE.wishlist.indexOf(productId);
    if (idx === -1) {
        STATE.wishlist.push(productId);
        Toast('Added to wishlist', 'success');
    } else {
        STATE.wishlist.splice(idx, 1);
        Toast('Removed from wishlist', 'warning');
    }
    saveWishlist();
    updateWishlistUI();
    displayWishlistItems();
}

function updateWishlistUI() {
    const badge = document.getElementById('wishlist-count');
    const count = (STATE.wishlist || []).length;
    if (badge) {
        badge.textContent = count;
        if (count > 0) badge.classList.add('active'); else badge.classList.remove('active');
    }
    // Update product card hearts
    document.querySelectorAll('[data-product-id]').forEach(el => {
        const pid = el.dataset.productId;
        const heart = el.querySelector('.wish-heart');
        if (heart) {
            if (STATE.wishlist.includes(pid)) heart.classList.add('active'); else heart.classList.remove('active');
        }
    });
}

function OpenWishlist() {
    console.log('OpenWishlist called');
    STATE.ui.wishlistOpen = true;
    const drawer = document.getElementById('wishlist-drawer');
    const backdrop = document.getElementById('backdrop');
    console.log('Wishlist drawer:', drawer);
    if (drawer && backdrop) {
        drawer.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Wishlist opened successfully');
    }
    displayWishlistItems();
}

function CloseWishlist() {
    STATE.ui.wishlistOpen = false;
    const drawer = document.getElementById('wishlist-drawer');
    const backdrop = document.getElementById('backdrop');
    if (drawer && backdrop) {
        drawer.classList.remove('active');
        if (!STATE.ui.cartOpen && !STATE.ui.searchOpen && !STATE.ui.productModalOpen) backdrop.classList.remove('active');
    }
    document.body.style.overflow = '';
}

function displayWishlistItems() {
    const container = document.getElementById('wishlist-items');
    if (!container) return;
    const list = STATE.wishlist || [];
    if (list.length === 0) {
        container.innerHTML = `\n            <div class="cart-empty">\n                <p>Your wishlist is empty.</p>\n                <button class="btn btn-small" data-command="GoToSection" data-target="new">Explore New</button>\n            </div>\n        `;
        return;
    }

    const items = list.map(pid => {
        let product = null;
        for (const cat in PRODUCTS) {
            const found = PRODUCTS[cat].find(p => p.id === pid);
            if (found) { product = found; break; }
        }
        if (!product) return '';
        return `\n            <div class="cart-item">\n                <div class="cart-item-image" style="background: ${product.image};"></div>\n                <div class="cart-item-info">\n                    <div class="cart-item-name">${product.name}</div>\n                    <div class="cart-item-price">$${product.price.toFixed(2)}</div>\n                    <div class="cart-item-qty">\n                        <button class="btn btn-small" data-command="OpenProduct" data-product-id="${product.id}">View</button>\n                        <button class="btn btn-small" data-command="AddToCart" data-product-id="${product.id}">Add to Cart</button>\n                        <button class="cart-item-remove" data-command="ToggleWishlist" data-product-id="${product.id}">Remove</button>\n                    </div>\n                </div>\n            </div>\n        `;
    }).join('');

    container.innerHTML = items;
}

// ==================== SERVICE WORKER REGISTRATION (PWA) ====================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/src/service-worker.js').then(reg => {
            console.log('Service worker registered:', reg.scope);
        }).catch(err => {
            console.warn('Service worker failed:', err);
        });
    }
}

// ==================== CUSTOM CURSOR ==================== 
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0;
let mouseY = 0;
let dotX = 0;
let dotY = 0;
let ringX = 0;
let ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;

    requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor expansion on interactive elements
const interactiveElements = document.querySelectorAll('a, button, input');

function addCursorListeners(elements) {
    elements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-expand');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-expand');
        });
    });
}

addCursorListeners(interactiveElements);

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
});

// ==================== MAGNETIC BUTTON EFFECT ====================
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.magnetic-btn');

    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
            const maxDistance = 100;

            if (distance < maxDistance) {
                const force = 1 - distance / maxDistance;
                const moveX = (mouseX / distance) * force * 15;
                const moveY = (mouseY / distance) * force * 15;

                button.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// ==================== HEADER SCROLL EFFECT ====================
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

function initScrollAnimations() {
    document.querySelectorAll('.section-title, .product-card, .tech-feature').forEach(el => {
        el.classList.add('scroll-fade-in');
        observer.observe(el);
    });
}

// ==================== PARALLAX EFFECT ====================
const heroSection = document.querySelector('.hero');
const heroGlow = document.querySelector('.hero-glow');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (heroSection) {
        const offset = scrollY * 0.5;
        heroSection.style.backgroundPosition = `0 ${offset}px`;
    }

    if (heroGlow) {
        const glowOffset = scrollY * 0.3;
        heroGlow.style.transform = `translate(-50%, calc(-50% + ${glowOffset}px))`;
    }
});

// ==================== COMMAND DISPATCHER ====================
document.addEventListener('click', (e) => {
    console.log('Click event:', e.target, e.target.tagName);
    
    // Try direct target first
    let target = e.target;
    if (target.dataset && target.dataset.command) {
        console.log('Direct click on command element:', target.dataset.command);
        const command = target.dataset.command;
        const args = {
            target: target.dataset.target,
            productId: target.dataset.productId,
            value: target.dataset.value,
            size: target.dataset.size,
            lineId: parseInt(target.dataset.lineId),
            delta: parseInt(target.dataset.delta)
        };
        ExecuteCommand(command, args);
        return;
    }
    
    // Then try closest
    target = e.target.closest('[data-command]');
    if (!target) {
        console.log('No [data-command] found');
        return;
    }

    const command = target.dataset.command;
    console.log('Command triggered:', command, target);
    const args = {
        target: target.dataset.target,
        productId: target.dataset.productId,
        value: target.dataset.value,
        size: target.dataset.size,
        lineId: parseInt(target.dataset.lineId),
        delta: parseInt(target.dataset.delta)
    };

    ExecuteCommand(command, args);
});

function ExecuteCommand(command, args = {}) {
    switch (command) {
        // Navigation
        case 'GoHome':
            GoHome();
            break;
        case 'Navigate':
            Navigate(args.url);
            break;
        case 'GoToSection':
            if (args.target) GoToSection(args.target);
            break;

        // Search
        case 'OpenSearchOverlay':
            OpenSearchOverlay();
            break;
        case 'CloseSearchOverlay':
            CloseSearchOverlay();
            break;

        // Products
        case 'OpenProduct':
            if (args.productId) OpenProduct(args.productId);
            break;
        case 'CloseProduct':
            CloseProduct();
            break;
        case 'SelectSize':
            if (args.value) SelectSize(args.value);
            break;
        case 'SetQty':
            if (args.value) SetQty(args.value);
            break;
        case 'OpenSizeGuide':
            if (args.productId) OpenSizeGuide(args.productId);
            break;
        case 'CloseSizeGuide':
            CloseSizeGuide();
            break;
        case 'FilterCategory':
            if (args.target) FilterCategory(args.target);
            break;

        // Cart
        case 'OpenCart':
            OpenCart();
            break;
        case 'CloseCart':
            CloseCart();
            break;
        case 'AddToCart':
            if (args.productId) AddToCart(args.productId);
            break;
        case 'RemoveFromCart':
            if (args.lineId !== undefined) RemoveFromCart(args.lineId);
            break;
        case 'ChangeQty':
            if (args.lineId !== undefined && args.delta) ChangeQty(args.lineId, args.delta);
            break;
        case 'BeginCheckout':
            BeginCheckout();
            break;

        // Newsletter
        case 'SubmitNewsletter':
            const email = document.querySelector('.newsletter-input')?.value;
            if (email) SubmitNewsletter(email);
            break;

        default:
            console.warn('Unknown command:', command);
    }
}

// ==================== SEARCH INPUT ====================
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                Search(e.target.value);
            }, 300);
        });

        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const firstResult = document.querySelector('.search-result-item');
                if (firstResult) {
                    firstResult.click();
                }
            } else if (e.key === 'Escape') {
                CloseSearchOverlay();
            }
        });
    }

    // Search result clicks
    document.addEventListener('click', (e) => {
        if (e.target.closest('.search-result-item')) {
            CloseSearchOverlay();
        }
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.querySelector('.newsletter-input').value;
            SubmitNewsletter(email);
        });
    }

    // Backdrop clicks
    document.getElementById('backdrop')?.addEventListener('click', () => {
        if (STATE.ui.cartOpen) CloseCart();
        if (STATE.ui.searchOpen) CloseSearchOverlay();
        if (STATE.ui.productModalOpen) CloseProduct();
        if (STATE.ui.sizeGuideOpen) CloseSizeGuide();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (STATE.ui.cartOpen) CloseCart();
            if (STATE.ui.searchOpen) CloseSearchOverlay();
            if (STATE.ui.productModalOpen) CloseProduct();
            if (STATE.ui.sizeGuideOpen) CloseSizeGuide();
        }
    });

    // Initialize everything
    loadCart();
    initMagneticButtons();
    initScrollAnimations();
    loadWishlist();
    initBackgroundMotion();
    registerServiceWorker();
});

console.log('%c✓ YOKER Loaded. Engineered for Motion.', 'font-size: 16px; color: #fff; background: #000; padding: 10px; letter-spacing: 2px;');

/* ==================== BACKGROUND MOTION (CANVAS PARTICLES) ==================== */
function initBackgroundMotion() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const DPR = Math.max(1, window.devicePixelRatio || 1);
    // Read settings (live-updatable via controller)
    const settings = BG_MOTION_SETTINGS;
    const PARTICLE_COUNT = Math.max(24, Math.round((w * h) / settings.densityDivisor));
    const particles = [];

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function createParticle() {
        const r = rand(0.6, 2.8);
        return {
            x: rand(0, window.innerWidth),
            y: rand(0, window.innerHeight),
            vx: rand(-0.25, 0.25) * settings.speedScale,
            vy: rand(-0.08, 0.08) * settings.speedScale,
            r,
            baseAlpha: rand(0.06, 0.42),
            alphaPhase: rand(0, Math.PI * 2),
            blur: rand(0, 12)
        };
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());

    let last = performance.now();
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };

    function resize() {
        w = canvas.width = Math.max(1, window.innerWidth) * DPR;
        h = canvas.height = Math.max(1, window.innerHeight) * DPR;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function step(now) {
        const dt = Math.min(40, now - last) / 16.666;
        last = now;

            // subtle trail (creates motion blur effect)
        ctx.fillStyle = `rgba(0,0,0,${settings.trailAlpha})`;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        for (let p of particles) {
            // gentle alpha pulse
            p.alphaPhase += 0.01 * dt;
            const alpha = p.baseAlpha * (0.85 + 0.3 * Math.sin(p.alphaPhase));

            // mouse attraction
            if (mouse.active) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist2 = dx * dx + dy * dy;
                const influence = Math.max(0, 150000 - dist2) / 150000; // close => stronger
                p.vx += (dx / (Math.sqrt(dist2) + 10)) * 0.0008 * influence * dt;
                p.vy += (dy / (Math.sqrt(dist2) + 10)) * 0.0005 * influence * dt;
            }

            // apply velocity and slight damping
            p.vx *= 0.995;
            p.vy *= 0.995;
            p.x += p.vx * dt * 16;
            p.y += p.vy * dt * 16;

            // wrap
            if (p.x < -20) p.x = window.innerWidth + 20;
            if (p.x > window.innerWidth + 20) p.x = -20;
            if (p.y < -20) p.y = window.innerHeight + 20;
            if (p.y > window.innerHeight + 20) p.y = -20;

            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.shadowColor = `rgba(255,255,255,${Math.min(0.9, alpha)})`;
            ctx.shadowBlur = p.blur;
            ctx.globalCompositeOperation = 'lighter';
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        requestAnimationFrame(step);
    }

    // mouse interaction (for attraction)
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
        clearTimeout(canvas._mouseTO);
        canvas._mouseTO = setTimeout(() => mouse.active = false, 1200);
    });

    window.addEventListener('resize', () => {
        clearTimeout(canvas._resizeTO);
        canvas._resizeTO = setTimeout(resize, 120);
    });

    resize();
    requestAnimationFrame(step);
}

// ==================== INITIALIZATION ====================
// Ensure DOM is ready before setting up listeners
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 YOKER initialized - DOM ready');
        initializeEventListeners();
    });
} else {
    console.log('🚀 YOKER initialized - DOM already ready');
    initializeEventListeners();
}

function initializeEventListeners() {
    console.log('Setting up event listeners...');
    
    // Test if elements exist
    const searchBtn = document.querySelector('.search-btn');
    const cartBtn = document.querySelector('.cart-btn');
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const header = document.querySelector('.header');
    
    console.log('Search button:', searchBtn);
    console.log('Cart button:', cartBtn);
    console.log('Wishlist button:', wishlistBtn);
    console.log('Header:', header);
    
    if (!searchBtn && !cartBtn && !wishlistBtn) {
        console.error('❌ No header buttons found! Check HTML structure.');
        return;
    }
    
    console.log('✓ All buttons and elements found');
    
    // Expose functions globally
    window.OpenSearchOverlay = OpenSearchOverlay;
    window.CloseSearchOverlay = CloseSearchOverlay;
    window.OpenCart = OpenCart;
    window.CloseCart = CloseCart;
    window.OpenWishlist = OpenWishlist;
    window.CloseWishlist = CloseWishlist;
    window.OpenProduct = OpenProduct;
    window.CloseProduct = CloseProduct;
    window.ExecuteCommand = ExecuteCommand;
    
    console.log('✓ Functions exported to window');
    
    loadCart();
}
