const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/user.controller");

// إنشاء حساب
router.post("/signup", signup);

// تسجيل دخول
router.post("/login", login);

module.exports = router;
