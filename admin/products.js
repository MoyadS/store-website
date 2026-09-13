const token = localStorage.getItem("adminToken");
if (!token) {
  window.location.href = "login.html";
}

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
      <button onclick="goToEdit('${p._id}')">✏️ تعديل</button>
    `;
    listDiv.appendChild(item);
  });
}

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

  if (!res.ok) {
    const error = await res.json();
    alert(error.message || "❌ حدث خطأ بالحذف");
    return;
  }

  alert("✅ تم حذف المنتج");
  loadProducts();
}

function goToEdit(id) {
  window.location.href = "index.html?edit=" + id;
}

loadProducts();