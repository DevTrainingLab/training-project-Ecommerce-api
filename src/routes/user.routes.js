const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/user.controller");
const { getMe } = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

// إنشاء حساب
router.post("/signup", signup);

// تسجيل دخول
router.post("/login", login);

// الحصول على بيانات المستخدم الحالي
router.get("/me", protect, getMe);

router.put("/me/password", protect, updatePassword);

module.exports = router;
