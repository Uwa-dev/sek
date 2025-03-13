
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


// Initialize the cart count
let cartCount = 0;

// Function to update the cart count
function updateCartCount() {
  cartCount++;
  document.querySelector('.cart-badge').textContent = cartCount;
}

// Example: Call updateCartCount when an item is added
// document.querySelector('.bxs-cart').addEventListener('click', () => {
//   updateCartCount();
// });

