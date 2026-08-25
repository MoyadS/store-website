const { validationResult } = require("express-validator");

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "❌ بيانات غير صحيحة",
      errors: errors.array().map(err => err.msg)
    });
  }

  next();
}

module.exports = validateRequest;