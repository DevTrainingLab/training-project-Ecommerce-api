const jwt = require("jsonwebtoken");
const User = require("../models/user.modal");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, "very-secret-jwt");
      req.user = await User.findById(decoded.id).select("-password"); // ما نرجعش الباسوورد
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
