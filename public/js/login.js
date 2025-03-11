document.querySelector("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const loginMessage = document.getElementById("login-message");

  loginMessage.textContent = "";

  try {
    const response = await fetch("http://localhost:5050/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
      loginMessage.textContent = "Login successful";
      loginMessage.style.color = ' #6b896b';
      localStorage.setItem("token", data.token);
      window.location.href = "./admin/index.html";
    } else {
      loginMessage.textContent = data.message;
      loginMessage.style.color = '#af4848';
    }
  } catch (error) {
    console.error("Error:", error);
    loginMessage.textContent = "An error occurred during login";
    loginMessage.style.color = '#af4848';
  }
});