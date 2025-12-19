
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

const CURRENT_USER_ID1 = checkAuthAndGetUserId(); 

// --- REST OF YOUR ORIGINAL product.js CODE FOLLOWS ---

const productDetailContainer = document.getElementById('product-detail-container');
const API_BASE = 'https://fakestoreapi.com/products/';

// ... (rest of product.js logic remains the same) ...

/**
 * 1. Helper Function to Get Product ID from URL
 * Reads the query parameters (e.g., ?id=5) from the browser's URL.
 * @returns {string | null} The product ID.
 */
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * 2. Rendering Function
 * Creates and inserts the detailed HTML for the product.
 */
function renderProductDetail(product) {
    productDetailContainer.innerHTML = `
        <div class="detail-image-box">
            <img src="${product.image}" alt="${product.title}" class="detail-image">
        </div>
        
        <div class="detail-info">
            <h2>${product.title}</h2>
            <p class="detail-category">${product.category}</p>
            
            <div class="product-rating">
                <p>Rating: ${product.rating.rate} / 5 (${product.rating.count} reviews)</p>
            </div>
            
            <p class="detail-price">$${product.price.toFixed(2)}</p>
            
            <p class="detail-description">${product.description}</p>
            
            <button class="detail-add-btn" data-id="${product.id}">Add to Cart</button>
        </div>
    `;
    
    // Attach event listener to the Add to Cart button
    productDetailContainer.querySelector('.detail-add-btn').addEventListener('click', (e) => {
        // Reuse the existing addToCart function from script.js
        if (typeof addToCart === 'function') {
            addToCart(e.target.dataset.id);
        } else {
            alert("Error: Cart logic not loaded.");
        }
    });
}

/**
 * 3. Main Fetching Function
 */
async function loadProduct() {
    const productId = getProductIdFromUrl();
    
    if (!productId) {
        productDetailContainer.innerHTML = '<p style="color: red;">Error: No product ID provided in the URL (e.g., product.html?id=1).</p>';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}${productId}`);
        
        if (!response.ok) {
            throw new Error('Product not found or network error.');
        }

        const product = await response.json();
        
        // Render the product details
        renderProductDetail(product);

    } catch (error) {
        console.error("Failed to load product details:", error);
        // productDetailContainer.innerHTML = <p style="color: red;">Failed to load product ID ${productId}. It may not exist.</p>;
    }
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the cart count updates
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    // Load the product detail
    loadProduct();
});

// --- UPDATE: Modify index.js links ---
// We need to make the product cards on index.html link to this new page.
// We should update createProductCard in script.js to wrap the card content in an <a> tag.