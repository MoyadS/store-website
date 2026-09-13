const token = localStorage.getItem("adminToken");
if (!token) {
  window.location.href = "login.html";
}

async function loadOrders() {
  const res = await fetch("/api/orders", {
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

  const orders = await res.json();
  const listDiv = document.getElementById("ordersList");
  listDiv.innerHTML = "";

  if (orders.length === 0) {
    listDiv.innerHTML = "<p>ما في طلبات لحد هلق</p>";
    return;
  }

  orders.forEach(order => {
    const itemsList = order.items.map(item =>
      `${item.name} × ${item.quantity} = ${item.price * item.quantity} $`
    ).join("<br>");

    const date = new Date(order.createdAt).toLocaleString("ar-EG");

    const card = document.createElement("div");
    card.className = "order-item";
    card.innerHTML = `
      <p><strong>رقم الطلب:</strong> ${order._id}</p>
      <p><strong>التاريخ:</strong> ${date}</p>
      <p><strong>الحالة:</strong> ${order.status}</p>
      <p><strong>المنتجات:</strong><br>${itemsList}</p>
      <p><strong>المجموع:</strong> ${order.total} $</p>
      <hr>
    `;
    listDiv.appendChild(card);
  });
}

loadOrders();