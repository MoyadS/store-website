const expressRouter = require("express");
const router = expressRouter.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// تسجيل الدخول
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: "❌ اسم المستخدم أو كلمة السر غلط" });
    }

    // مقارنة كلمة السر المدخلة مع النسخة المشفرة بالداتابيس
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "❌ اسم المستخدم أو كلمة السر غلط" });
    }

    // إنشاء token صالح لمدة يوم واحد
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "✅ تم تسجيل الدخول", token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ حدث خطأ بالسيرفر" });
  }
});

module.exports = router;