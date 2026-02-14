// controllers/user.controller.js
const User = require("../models/user.modal");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// توليد JWT
const generateToken = (id) => {
  return jwt.sign({ id }, "very-secret-jwt", { expiresIn: "30d" });
};

// =======================
// تسجيل حساب جديد (Sign Up)
// =======================
const signup = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// تسجيل دخول (Login)
// =======================
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// جلب بيانات اليوزر الحالي
// =======================
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

// =======================
// تحديث بيانات المستخدم
// =======================
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { firstName, lastName, email, phone } = req.body;

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.email = email || user.email;
  user.phone = phone || user.phone;

  await user.save();

  res.status(200).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    token: generateToken(user._id),
  });
};

// =======================
// تحديث الباسوورد
// =======================
const updatePassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { currentPassword, newPassword } = req.body;

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
};

module.exports = { signup, login, getMe, updateProfile, updatePassword };
