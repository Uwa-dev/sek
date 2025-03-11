let cart = []; // This will hold product IDs added to the cart

// Save the cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Load the cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Function to render products
function renderProducts() {
  const container = document.querySelector(".all-items-container");
  container.innerHTML = ""; // Clear existing products

  products.forEach(product => {
    const isInWishlist = wishlist.includes(product._id); // Check if the product is in the wishlist
    const isInCart = cart.includes(product._id); // Check if the product is in the cart

    const productHTML = `
      <div class="items-container">
        <div class="product-img-container">
          <img src="/images/${product.image}" alt="${product.name}">
          <i class="bx ${
            isInWishlist ? "bxs-heart" : "bx-heart"
          } wishlist-icon" data-id="${product._id}"></i>
        </div>
        <div class="product-text">
          <h4>${product.name}</h4>
          <p>#${product.price}</p>
          <button class="product-btn add-to-cart-btn" data-id="${product._id}">
            ${isInCart ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    `;
    container.innerHTML += productHTML;
  });

  attachWishlistEventListeners(); // Reattach event listeners
  attachCartEventListeners(); // Reattach event listeners
}

// Attach event listeners to Add to Cart buttons
function attachCartEventListeners() {
  const container = document.querySelector(".all-items-container");

  container.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart-btn")) {
      const productId = event.target.dataset.id;

      if (cart.includes(productId)) {
        // Item is already in the cart
        console.log("Item already in the cart.");
      } else {
        // Add to cart
        cart.push(productId);
        event.target.innerText = "In Cart";
        saveCart(); // Save the updated cart to localStorage
        console.log("Item added to the cart:", productId);
      }
    }
  });
}

// Initialize cart and fetch products on page load
window.addEventListener("DOMContentLoaded", () => {
  loadCart(); // Load cart from localStorage
  loadWishlist(); // Load wishlist from localStorage
  fetchProducts(); // Fetch products and render them
});
