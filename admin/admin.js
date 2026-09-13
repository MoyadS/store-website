// تحقق من وجود تسجيل دخول قبل ما تفتح الصفحة
const token = localStorage.getItem("adminToken");
if (!token) {
  window.location.href = "login.html";
}

let editingId = null;

const form = document.getElementById("addForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(form));

  const url = editingId ? "/api/products/" + editingId : "/api/products";
  const method = editingId ? "PUT" : "POST";

  const res = await fetch(url, {
    method: method,
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

  if (!res.ok) {
    const error = await res.json();
    const messages = error.errors ? error.errors.join("\n") : error.message;
    alert(messages || "❌ حدث خطأ");
    return;
  }

  alert(editingId ? "✅ تم تعديل المنتج!" : "✅ تمت إضافة المنتج!");
  form.reset();
  editingId = null;
  form.querySelector("button[type=submit]").textContent = "إضافة";
});

// لو الرابط فيه ?edit=ID، عبّي الفورم تلقائياً بذاك المنتج
const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get("edit");

if (editId) {
  loadProductForEdit(editId);
}

async function loadProductForEdit(id) {
  const res = await fetch("/api/products");
  const products = await res.json();
  const product = products.find(p => p._id === id);

  if (!product) return;

  form.name.value = product.name;
  form.price.value = product.price;
  form.description.value = product.description;
  form.image.value = product.image || "";
  form.stock.value = product.stock;

  editingId = id;
  form.querySelector("button[type=submit]").textContent = "💾 حفظ التعديل";
}