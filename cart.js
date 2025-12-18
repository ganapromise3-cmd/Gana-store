// --- ADD LOGIN GUARD AT THE VERY TOP OF cart.js ---
function checkAuthAndGetUserId() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentUserId = sessionStorage.getItem('currentUserId');
    
    if (!isLoggedIn || !currentUserId) {
        if (!window.location.href.includes('auth.html')) {
            window.location.href = 'auth.html';
        }
        return null;
    }
    return currentUserId;
}

const CURRENT_USER_ID = checkAuthAndGetUserId(); 

// --- REST OF YOUR ORIGINAL cart.js CODE FOLLOWS ---

const cartItemsElement = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal-amount');
const totalElement = document.getElementById('total-amount');
const CART_API_BASE = 'https://fakestoreapi.com/products/';

// --- UPDATE getCart AND saveCart FUNCTIONS ---
function getCart() {
    if (!CURRENT_USER_ID) return [];
    return JSON.parse(localStorage.getItem`(cart_${CURRENT_USER_ID})`) || [];
}

function saveCart(cart) {
    if (!CURRENT_USER_ID) return;
    localStorage.setItem(`cart_${CURRENT_USER_ID}`, JSON.stringify(cart));
    // ... (rest of the saveCart logic remains the same) ...
}

// ... (rest of the cart.js logic remains the same, as it relies on getCart/saveCart) ...


/**
 * Helper function to retrieve cart data from localStorage.
 * @returns {Array} The cart array or an empty array.
 */
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

/**
 * Helper function to save cart data to localStorage.
 * @param {Array} cart - The updated cart array.
 */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Since script.js is also loaded, we can call its update function
    if (typeof updateCartCount === 'function') {
        updateCartCount(); 
    }
}

/**
 * 1. Cart Rendering Function
 * Creates the HTML for a single item in the cart list.
 */
function createCartItemElement(item, productDetails) {
    const itemTotal = (productDetails.price * item.quantity).toFixed(2);
    
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.dataset.id = item.id;
    div.innerHTML = `
        <img src="${productDetails.image}" alt="${productDetails.title}" class="item-image">
        
        <div class="item-details">
            <h4>${productDetails.title}</h4>
            <p>Unit Price: $${productDetails.price.toFixed(2)}</p>
        </div>

        <div class="item-controls">
            <button class="control-btn decrease-qty" data-id="${item.id}">-</button>
            <input type="number" value="${item.quantity}" min="1" class="quantity-input" readonly>
            <button class="control-btn increase-qty" data-id="${item.id}">+</button>
        </div>

        <div class="item-price">
            <strong>$${itemTotal}</strong>
        </div>

        <span class="remove-btn" data-id="${item.id}">Remove</span>
    `;

    // Attach event listeners for quantity changes and removal
    div.querySelector('.increase-qty').addEventListener('click', () => updateQuantity(item.id, 1));
    div.querySelector('.decrease-qty').addEventListener('click', () => updateQuantity(item.id, -1));
    div.querySelector('.remove-btn').addEventListener('click', () => removeItem(item.id));

    return div;
}

/**
 * 2. Main Fetching and Display Function
 */
async function loadCart() {
    cartItemsElement.innerHTML = '<p>Loading your cart items...</p>';
    const cart = getCart();
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p>Your cart is empty. <a href="index.html">Start shopping now!</a></p>';
        updateSummary(0);
        return;
    }

    // Create an array of Promises to fetch all product details concurrently
    const fetchPromises = cart.map(item => fetch(`${CART_API_BASE}${item.id}`).then(res => res.json()));

    try {
        // Wait for all promises to resolve
        const productDetailsArray = await Promise.all(fetchPromises);

        cartItemsElement.innerHTML = ''; // Clear loading message
        let calculatedTotal = 0;

        productDetailsArray.forEach((productDetails, index) => {
            const cartItem = cart[index];
            
            // Check if the product was successfully fetched (ID check is a safeguard)
            if (productDetails.id) {
                const itemElement = createCartItemElement(cartItem, productDetails);
                cartItemsElement.appendChild(itemElement);
                calculatedTotal += productDetails.price * cartItem.quantity;
            } else {
                console.error(`Could not fetch details for item ID: ${cartItem.id}`);
            }
        });

        updateSummary(calculatedTotal);

    } catch (error) {
        console.error("Error loading cart details:", error);
        cartItemsElement.innerHTML = '<p style="color: red;">Error fetching cart details. Please refresh.</p>';
    }
}

/**
 * 3. Cart Modification Functions
 */
function updateQuantity(productId, delta) {
    const id = parseInt(productId);
    let cart = getCart();

    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;
        
        // Remove item if quantity drops to 0 or less
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }

        saveCart(cart);
        loadCart(); // Reload the cart to update the DOM and totals
    }
}

function removeItem(productId) {
    const id = parseInt(productId);
    let cart = getCart();

    const newCart = cart.filter(item => item.id !== id);

    saveCart(newCart);
    loadCart(); // Reload the cart
}

/**
 * 4. Summary Update Function
 */
function updateSummary(subtotal) {
    // For this simple shop, Subtotal = Total
    const shipping = 0; // Simple shop, free shipping

    subtotalElement.textContent =`$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${(subtotal + shipping).toFixed(2)}`;
}

// Event listener for the "Checkout" button
document.getElementById('checkout-btn').addEventListener('click', () => {
    alert('Checkout functionality is not yet implemented in this frontend-only demo!');
    // In a real app, this would send cart data to the backend.
});


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', loadCart);