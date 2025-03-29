
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

// Function to update the cart badge on the current page
function updateCartBadge() {
  const cartBadge = document.querySelector(".cart-badge");
  if (cartBadge) {
    // Fetch cart from localStorage to ensure the badge reflects the current state
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
  }
}

// Call the function when the page loads
window.onload = updateCartBadge;

