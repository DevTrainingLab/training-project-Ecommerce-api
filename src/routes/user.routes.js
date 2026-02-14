// routes/user.routes.js
const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getMe,
  updateProfile,
  updatePassword,
} = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/me", protect, updateProfile);
router.patch("/me/password", protect, updatePassword);

module.exports = router;
