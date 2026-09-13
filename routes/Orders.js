const expressRouter = require("express");
const router = expressRouter.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const verifyToken = require("../middleware/verifyToken");

// إنشاء طلب جديد
router.post("/", async (req, res) => {
  try {
    const cartItems = req.body.items; // [{ productId, quantity }, ...]

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "❌ السلة فاضية" });
    }

    let orderItems = [];
    let total = 0;

    for (const cartItem of cartItems) {
      const product = await Product.findById(cartItem.productId);

      if (!product) {
        return res.status(404).json({ message: `❌ منتج غير موجود` });
      }

      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          message: `❌ الكمية المتوفرة من "${product.name}" غير كافية (متوفر: ${product.stock})`
        });
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity
      });

      total += product.price * cartItem.quantity;

      product.stock -= cartItem.quantity;
      await product.save();
    }

    const newOrder = new Order({
      items: orderItems,
      total: total
    });

    await newOrder.save();

    res.json({ message: "✅ تم إنشاء الطلب بنجاح", orderId: newOrder._id, total });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ حدث خطأ بالسيرفر" });
  }
});

// جلب كل الطلبات
router.get("/", verifyToken, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;