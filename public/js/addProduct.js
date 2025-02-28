document.querySelector("#product-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  // const email = document.getElementById("email").value;
  // const password = document.getElementById("password").value;
  // const loginMessage = document.getElementById("login-message");

  const productName = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const category = document.getElementById('categoryName').value;
  const addMsg = document.getElementById('add-message')
  const image = document.getElementById("productImage").files[0];

  addMsg.textContent = "";

  const formData = new FormData();
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", image);

  try {
    const response = await fetch("http://localhost:5050/api/products/add", {
      method: "POST",
      // headers: { "Content-Type": "application/json" },
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      addMsg.textContent = "Product added successfully";
      addMsg.style.color = ' #1ca31c';
    } else {
      addMsg.textContent = data.message;
      addMsg.style.color = '#b93030';
    }
  } catch (error) {
    console.error("Error:", error);
    addMsg.textContent = 'An error occurred';
    addMsg.style.color = '#b93030';
  }
});