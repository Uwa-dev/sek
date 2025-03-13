// shared.js
let products = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Update the cart badge
function updateCartBadge() {
  const cartBadge = document.querySelector(".cart-badge");
  if (cartBadge) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Save wishlist to localStorage
function saveWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Function to show toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = message;
    toast.classList.add("show");

    // Hide the toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

// Add product to cart
function addToCart(productId) {
  const product = products.find(p => p._id === productId);

  if (product) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ 
        id: productId, 
        name: product.name, 
        price: product.price, 
        quantity: 1, 
        image: product.image 
      });
    }
    saveCart();
    updateCartBadge();
    showToast(`${product.name} has been added to your cart!`);
  }
}

// Toggle product in wishlist
function toggleWishlist(productId, iconElement) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
    iconElement.classList.remove("bxs-heart");
    iconElement.classList.add("bx-heart");
  } else {
    wishlist.push(productId);
    iconElement.classList.remove("bx-heart");
    iconElement.classList.add("bxs-heart");
  }
  saveWishlist();
}