const { body } = require("express-validator");

const productValidationRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("اسم المنتج مطلوب"),

  body("price")
    .isFloat({ min: 0.01 }).withMessage("السعر لازم يكون رقم أكبر من صفر"),

  body("description")
    .trim()
    .notEmpty().withMessage("الوصف مطلوب"),

  body("stock")
    .isInt({ min: 0 }).withMessage("الكمية لازم تكون رقم صحيح مش سالب")
];

module.exports = productValidationRules;