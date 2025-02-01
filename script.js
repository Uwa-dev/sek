document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll('[data-animation="fade-in"]');

  elements.forEach((el) => {
    el.style.setProperty("--animation-delay", "0s"); // Optional: Set delay
  });
});
