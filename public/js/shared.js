document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll('[data-animation="fade-in"]');

  elements.forEach((el) => {
    el.style.setProperty("--animation-delay", "0s"); // Optional: Set delay
  });
});

function showSideBar(){
  const sidebar = document.querySelector('.phone-nav');

  if(sidebar.style.display === 'none'){
    sidebar.style.display = 'flex'
  } else {
    sidebar.style.display = 'none'
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginAnchor = document.querySelector(".login-btn");

  // Check if the user is logged in
  const token = localStorage.getItem("token");

  if (token) {
    // User is logged in, replace the anchor tag with a button
    const logoutButton = document.createElement("button");
    logoutButton.textContent = "Logout";
    logoutButton.className = "logout-btn";

    // Add logout functionality
    logoutButton.addEventListener("click", async() => {
      try {
        const response = await fetch("http://localhost:5050/api/user/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.removeItem("token"); // Clear token from localStorage
          
          // Redirect to the correct index.html based on the current location
          const currentPath = window.location.pathname;
          if (currentPath.includes("/admin/")) {
            window.location.href = "../index.html"; 
          } else {
            window.location.href = "./index.html"; 
          }
        } else {
          alert(data.message || "Logout failed. Please try again.");
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    });

    // Replace the login anchor with the logout button
    loginAnchor.replaceWith(logoutButton);
  }
});

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