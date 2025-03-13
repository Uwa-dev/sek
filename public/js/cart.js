// cart.js
import { getCart } from './shared.js';

const cartContainer = document.querySelector('.cart-container');
const totalItemsElem = document.getElementById('total-items');
const totalPriceElem = document.getElementById('total-price');

function renderCart() {
  const cart = getCart();
  cartContainer.innerHTML = ''; // Clear previous items

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach((item) => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <h3>${item.name}</h3>
      <p>Price: #${item.price.toFixed(2)}</p>
      <p>Quantity: ${item.quantity}</p>
    `;
    cartContainer.appendChild(cartItem);
  });

  totalItemsElem.textContent = totalItems;
  totalPriceElem.textContent = totalPrice.toFixed(2);
}

renderCart();
