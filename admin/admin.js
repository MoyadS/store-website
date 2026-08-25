// تحقق من وجود تسجيل دخول قبل ما تفتح الصفحة
const token = localStorage.getItem("adminToken");
if (!token) {
  window.location.href = "login.html";
}

const form = document.getElementById("addForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(form));

  const res = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(formData)
  });

  if (res.status === 401) {
    alert("❌ الجلسة منتهية، سجّل دخول من جديد");
    localStorage.removeItem("adminToken");
    window.location.href = "login.html";
    return;
  }

  alert("✅ تمت إضافة المنتج!");
  form.reset();
});