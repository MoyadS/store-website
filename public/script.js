let cart = JSON.parse(localStorage.getItem("cart")) || [];
let delivery = 10;

// تحميل المنتجات
fetch("/api/products")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("products");

    data.forEach(p => {
      const div = document.createElement("div");
      div.className = "product";

      div.innerHTML = `
        <img src="${p.image}" width="100%">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <strong>${p.price} $</strong>
        <br>
        <button onclick="addToCart('${p._id}', '${p.name}', ${p.price})">
          🛒 أضف للسلة
        </button>
      `;

      container.appendChild(div);
    });
  });

// إضافة للسلة
function addToCart(id, name, price) {
  let product = cart.find(item => item.id === id);

  if (product) {
    product.quantity++;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  updateCart();
}

// تحديث السلة
function updateCart() {
  const itemsList = document.getElementById("cart-items");
  const count = document.getElementById("cart-count");
  const total = document.getElementById("cart-total");
  const final = document.getElementById("cart-final");

  itemsList.innerHTML = "";

  let totalPrice = 0;
  let totalItems = 0;

  cart.forEach(item => {
    let li = document.createElement("li");

    li.innerHTML = `
  ${item.name} × ${item.quantity} = ${item.price * item.quantity} $
  <button onclick="changeQty('${item.id}', 1)">+</button>
  <button onclick="changeQty('${item.id}', -1)">-</button>
`;

    itemsList.appendChild(li);

    totalPrice += item.price * item.quantity;
    totalItems += item.quantity;
  });

  count.textContent = totalItems;
  total.textContent = totalPrice;
  final.textContent = totalPrice + delivery;

  localStorage.setItem("cart", JSON.stringify(cart));
}

// تغيير الكمية
function changeQty(id, amount) {
  let product = cart.find(item => item.id === id);

  if (!product) return;

  product.quantity += amount;

  if (product.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  updateCart();
}
// إتمام الطلب
function checkout() {
  const messageBox = document.getElementById("order-message");

  if (cart.length === 0) {
    messageBox.textContent = "❌ السلة فاضية";
    return;
  }

  const orderItems = cart.map(item => ({
    productId: item.id,
    quantity: item.quantity
  }));

  fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: orderItems })
  })
    .then(res => res.json())
    .then(data => {
      if (data.orderId) {
        messageBox.textContent = "✅ تم إرسال طلبك بنجاح! رقم الطلب: " + data.orderId;
        cart = [];
        localStorage.removeItem("cart");
        updateCart();
      } else {
        messageBox.textContent = data.message || "❌ حدث خطأ";
      }
    })
    .catch(err => {
      console.error(err);
      messageBox.textContent = "❌ ما قدرنا نوصل للسيرفر";
    });
}