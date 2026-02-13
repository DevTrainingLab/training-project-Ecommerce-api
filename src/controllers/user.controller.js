const User = require("../models/user.modal");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// توليد JWT
const generateToken = (id) => {
  return jwt.sign({ id }, "very-secret-jwt", { expiresIn: "30d" });
};

// =======================
// تسجيل حساب جديد (Sign Up)
// =======================
const signup = async (req, res) => {
  const { name, phoneOrEmail, password } = req.body;
  try {
    const userExists = await User.findOne({ phoneOrEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, phoneOrEmail, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      phoneOrEmail: user.phoneOrEmail,
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
  const { phoneOrEmail, password } = req.body;
  try {
    const user = await User.findOne({ phoneOrEmail });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        phoneOrEmail: user.phoneOrEmail,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid phone/email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  signup,
  login,
};
