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
