// Sample product data
const products = [
    {
        id: 1,
        name: "Rare Dragon Card",
        category: "rare",
        price: 45.99,
        description: "Legendary dragon with powerful abilities",
        emoji: "🐉"
    },
    {
        id: 2,
        name: "Shadow Assassin",
        category: "rare",
        price: 38.50,
        description: "Stealthy unit perfect for aggressive decks",
        emoji: "🗡️"
    },
    {
        id: 3,
        name: "Common Soldier Pack",
        category: "common",
        price: 2.99,
        description: "Essential common cards for any deck",
        emoji: "🪖"
    },
    {
        id: 4,
        name: "Booster Pack - Forest Set",
        category: "booster",
        price: 8.99,
        description: "Contains 10 random forest-themed cards",
        emoji: "🌲"
    },
    {
        id: 5,
        name: "Ultimate Starter Deck",
        category: "deck",
        price: 24.99,
        description: "Perfect for beginners starting their journey",
        emoji: "📚"
    },
    {
        id: 6,
        name: "Fire Elemental",
        category: "rare",
        price: 52.00,
        description: "Devastating AoE damage dealer",
        emoji: "🔥"
    },
    {
        id: 7,
        name: "Booster Pack - Ice Set",
        category: "booster",
        price: 8.99,
        description: "Contains 10 random ice-themed cards",
        emoji: "❄️"
    },
    {
        id: 8,
        name: "Mystical Wizard",
        category: "rare",
        price: 42.50,
        description: "Master of arcane magic and spells",
        emoji: "🧙"
    },
    {
        id: 9,
        name: "Common Archer Pack",
        category: "common",
        price: 3.50,
        description: "Ranged attackers for strategic gameplay",
        emoji: "🏹"
    },
    {
        id: 10,
        name: "Competitive Ranked Deck",
        category: "deck",
        price: 39.99,
        description: "Tournament-ready competitive deck",
        emoji: "🏆"
    },
    {
        id: 11,
        name: "Light Guardian",
        category: "rare",
        price: 48.75,
        description: "Protective support unit for control decks",
        emoji: "👼"
    },
    {
        id: 12,
        name: "Booster Pack - Shadow Set",
        category: "booster",
        price: 9.99,
        description: "Contains 10 random shadow-themed cards",
        emoji: "🌑"
    },
    {
         id: 13,
        name: "Adatatron",
        category: "OGN",
        price: 20,000,
        description: "Adatatron",
        emoji: "🌑"
    }
];

// Shopping cart
let cart = [];

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts(products);
    loadCartFromStorage();
    updateCartDisplay();
});

// Load and display products
function loadProducts(productsToDisplay) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">No products found. Try adjusting your filters.</div>';
        return;
    }

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <span class="product-category">${product.category.toUpperCase()}</span>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            emoji: product.emoji
        });
    }

    saveCartToStorage();
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`);
}

// Update cart display
function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalSpan = document.getElementById('cart-total');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;

    // Update cart items display
    cartItemsDiv.innerHTML = '';
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; color: #757575; padding: 2rem;">Your cart is empty</p>';
        cartTotalSpan.textContent = '0.00';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-name">${item.emoji} ${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button onclick="decreaseQuantity(${item.id})" style="width: 30px; height: 30px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">-</button>
                <input type="text" value="${item.quantity}" class="cart-item-quantity" readonly style="width: 40px; text-align: center;">
                <button onclick="increaseQuantity(${item.id})" style="width: 30px; height: 30px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsDiv.appendChild(cartItem);
    });

    cartTotalSpan.textContent = total.toFixed(2);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartDisplay();
}

// Increase quantity
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
        saveCartToStorage();
        updateCartDisplay();
    }
}

// Decrease quantity
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(productId);
            return;
        }
        saveCartToStorage();
        updateCartDisplay();
    }
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCartToStorage();
        updateCartDisplay();
        showNotification('Cart cleared!');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your purchase!\n\nTotal: $${total.toFixed(2)}\n\nYour order has been placed successfully. You will receive a confirmation email shortly.`);
    cart = [];
    saveCartToStorage();
    updateCartDisplay();
    toggleCart();
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('active');
}

// Filter products
function filterProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const priceFilter = document.getElementById('price-filter').value;

    let filtered = products.filter(product => {
        // Search filter
        const matchesSearch = product.name.toLowerCase().includes(searchInput) ||
                            product.description.toLowerCase().includes(searchInput);
        
        // Category filter
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        
        // Price filter
        let matchesPrice = true;
        if (priceFilter) {
            const [min, max] = priceFilter.split('-');
            const minPrice = parseFloat(min);
            const maxPrice = max === '+' ? Infinity : parseFloat(max);
            matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        }

        return matchesSearch && matchesCategory && matchesPrice;
    });

    loadProducts(filtered);
}

// Scroll to shop section
function scrollToShop() {
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
}

// Show notification
function showNotification(message) {
    // Create a simple notification (could be enhanced with a toast library)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 300;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Local storage functions
function saveCartToStorage() {
    localStorage.setItem('riftbound-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('riftbound-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Add slide-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);
