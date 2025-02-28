document.querySelector("#register-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const errorMessageDiv = document.getElementById("error-message");

  errorMessageDiv.textContent = "";

  if (password !== confirmPassword) {
    errorMessageDiv.textContent = "Passwords do not match";
    errorMessageDiv.style.color = '#af4848';
    return;
  }
  try {
    const response = await fetch("http://localhost:5050/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    console.log("Response from server:", data); // Log server response


    
    if (data.success) {
      errorMessageDiv.textContent = "Registration successful";
      errorMessageDiv.style.color = '#6b896b';
      window.location.href = "./login.html";
    } else {
      // Show error message from backend
      errorMessageDiv.textContent = data.message;
      errorMessageDiv.style.color = '#af4848';
    }
  } catch (error) {
    console.error("Error:", error);
    errorMessageDiv.textContent = "An error occurred during registration.";
  }
});