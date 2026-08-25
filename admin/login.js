const form = document.getElementById("loginForm");
const messageBox = document.getElementById("login-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(form));

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("adminToken", data.token);
    window.location.href = "index.html";
  } else {
    messageBox.textContent = data.message || "❌ حدث خطأ";
  }
});