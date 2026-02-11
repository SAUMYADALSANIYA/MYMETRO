const API_URL = "http://localhost:5001/api/auth";

/* ================= SIGNUP ================= */
async function validateSignup(event) {
  event.preventDefault();  // 🔥 THIS IS IMPORTANT

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  
  try {
    const confirmPassword = document.getElementById("confirm_password").value;

if (password !== confirmPassword) {
  alert("Passwords do not match");
  return false;
}

    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return false;
    }

    alert("Signup successful! Please login.");
    window.location.href = "login.html";
    return false;

  } catch (error) {
    alert("Backend not running");
    return false;
  }
}

/* ================= LOGIN ================= */
async function validateLogin(event) {
  event.preventDefault(); 
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return false;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Login successful");
    window.location.href = "index.html";
    return false;

  } catch (error) {
    console.log(error);
    alert("Backend error - check console");
  }
  
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
