// --- ADD THIS LOGIC AT THE VERY TOP OF script.js ---
function checkAuthAndGetUserId() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentUserId = sessionStorage.getItem('currentUserId');
    
    if (!isLoggedIn || !currentUserId) {
        // Redirect if not logged in
        if (!window.location.href.includes('auth.html')) {
            window.location.href = 'auth.html';
        }
        return null;
    }
    return currentUserId;
}

const CURRENT_USER_ID = checkAuthAndGetUserId(); 

// --- REST OF YOUR ORIGINAL script.js CODE FOLLOWS ---


// --- UPDATE THE updateCartCount FUNCTION ---
function updateCartCount() {
    // Return early if not logged in (to prevent error)
    if (!CURRENT_USER_ID) return; 
    
    // Use the user-specific key
    const cart = JSON.parse(localStorage.getItem(`cart_${CURRENT_USER_ID}`)) || []; 
    
    // Calculate the total number of items (sum of all quantities)
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElement.textContent = totalItems;
}


// --- UPDATE THE addToCart FUNCTION ---
function addToCart(productId) {
    if (!CURRENT_USER_ID) return; // Guard
    
    // Use the user-specific key
    let cart = JSON.parse(localStorage.getItem(`cart_${CURRENT_USER_ID}`)) || []; 
    const id = parseInt(productId);

    // ... (rest of the logic remains the same) ...

    // Save the updated cart back to localStorage using the user-specific key
    localStorage.setItem(`cart_${CURRENT_USER_ID}, JSON.stringify(cart)`);
    
    // Update the visual counter
    updateCartCount();

    console.log(`Product ID ${id} added to cart for user ${CURRENT_USER_ID}.`);
}

// ... (rest of the initialization logic remains the same) ...


const productListElement = document.getElementById('product-list');
const cartCountElement = document.getElementById('cart-count');

// API URL for fetching all products from FakeStoreAPI
const API_URL = 'https://fakestoreapi.com/products?limit=12'; 

/**
 * 1. CART MANAGEMENT HELPER FUNCTION
 * Updates the visible cart counter in the header.
 */
function updateCartCount() {
    // Retrieve the cart from localStorage, or initialize as an empty array
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calculate the total number of items (sum of all quantities)
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElement.textContent = totalItems;
}

/**
 * 2. RENDERING FUNCTIONS
 * Creates the HTML structure for a single product card.
 * *** THIS FUNCTION IS UPDATED TO INCLUDE THE LINK TO product.html ***
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('product-card');

    // Wrap the details section in an anchor tag pointing to the detail page
    card.innerHTML = `
        <a href="product.html?id=${product.id}" style="text-decoration: none; color: inherit; display: contents;">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image">
            </div>
            <div class="product-details">
                <h3>${product.title}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
        </a>
        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
    `;

    // Add event listener directly to the ADD TO CART button (which is outside the <a> tag)
    card.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
        const productId = e.target.dataset.id;
        addToCart(productId);
    });

    return card;
}

/**
 * Main function to fetch and render all products.
 */
async function fetchAndRenderProducts() {
    try {
        productListElement.innerHTML = '<p>Fetching data of Gana store...</p>'; // Show loading message
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // FakeStore API returns the product array directly
        const products = data; 
        
        // Clear loading message
        productListElement.innerHTML = ''; 

        // Append each product card to the product list container
        products.forEach(product => {
            const card = createProductCard(product);
            productListElement.appendChild(card);
        });

    } catch (error) {
        console.error("Failed to load products:", error);
        productListElement.innerHTML = '<p style="color: red;">Failed to load products. Please try again later.</p>';
    }
}

/**
 * 3. CART LOGIC
 * Handles adding a product to the cart array in localStorage.
 * This function is reused on the detail page (product.js) and the main page.
 */
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const id = parseInt(productId);

    const existingItemIndex = cart.findIndex(item => item.id === id);

    if (existingItemIndex > -1) {
        // Product exists: Increase quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Product is new: Add to cart
        cart.push({ id: id, quantity: 1 });
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update the visual counter
    updateCartCount();

    console.log`(Product ID ${id} added to cart. Current Cart:, cart)`;
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch and display products when the page loads (only relevant for index.html)
    if (productListElement) {
         fetchAndRenderProducts();
    }
    
    // 2. Ensure the cart count is correct on page load
    updateCartCount();
});