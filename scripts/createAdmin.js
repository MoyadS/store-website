require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const username = "Moyad"; // غيّرها لاسم مستخدم من اختيارك
  const plainPassword = "Mosasa"; // غيّرها لكلمة سر قوية من اختيارك

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log("⚠️ في حساب أدمن بنفس الاسم موجود أصلاً");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const newAdmin = new Admin({ username, password: hashedPassword });
  await newAdmin.save();

  console.log("✅ تم إنشاء حساب الأدمن بنجاح");
  process.exit();
}

createAdmin();