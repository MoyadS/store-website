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

  alert(editingId ? "✅ تم تعديل المنتج!" : "✅ تمت إضافة المنتج!");
  form.reset();
  editingId = null;
  form.querySelector("button[type=submit]").textContent = "إضافة";
  loadProducts();
});

// جلب وعرض كل المنتجات
async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  const listDiv = document.getElementById("productsList");
  listDiv.innerHTML = "";

  products.forEach(p => {
    const item = document.createElement("div");
    item.className = "product-item";
    item.innerHTML = `
      <strong>${p.name}</strong> - ${p.price} $ (الكمية: ${p.stock})
      <button onclick="deleteProduct('${p._id}')">🗑️ حذف</button>
      <button onclick="editProduct('${p._id}')">✏️ تعديل</button>
    `;
    listDiv.appendChild(item);
  });
}

// حذف منتج
async function deleteProduct(id) {
  const confirmed = confirm("متأكد إنك بدك تحذف هالمنتج؟");
  if (!confirmed) return;

  const res = await fetch("/api/products/" + id, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  if (res.status === 401) {
    alert("❌ الجلسة منتهية، سجّل دخول من جديد");
    localStorage.removeItem("adminToken");
    window.location.href = "login.html";
    return;
  }

  alert("✅ تم حذف المنتج");
  loadProducts();
}

// تعديل منتج
async function editProduct(id) {
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

// تحميل المنتجات فور فتح الصفحة
loadProducts();