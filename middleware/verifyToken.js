const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "❌ ما في تسجيل دخول" });
  }

  // شكل الهيدر المتوقع: "Bearer <token>"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "❌ التوكن مفقود" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // نخزّن بيانات الأدمن بالـ request حتى تصير متاحة بالراوت اللي بعده
    next(); // كل شي تمام، كمّل للراوت الأصلي
  } catch (err) {
    return res.status(401).json({ message: "❌ التوكن غير صالح أو منتهي" });
  }
}

module.exports = verifyToken;