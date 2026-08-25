const expressRouter = require("express");
const router = expressRouter.Router();
const Product = require("../models/Product");
const verifyToken = require("../middleware/verifyToken");
const productValidationRules = require("./productValidation");
const validateRequest = require("../middleware/validateRequest");

// جلب جميع المنتجات
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// إضافة منتج جديد
router.post("/", verifyToken, productValidationRules, validateRequest, async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json({ message: "✅ Product added" });
});

// تعديل منتج
router.put("/:id", verifyToken, productValidationRules, validateRequest, async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "✏️ Product updated" });
});

// حذف منتج
router.delete("/:id", verifyToken, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "🗑️ Product deleted" });
});

module.exports = router;