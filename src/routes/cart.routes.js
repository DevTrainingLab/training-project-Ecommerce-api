const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect); // تأكد من أن المستخدم مسجل الدخول قبل الوصول إلى أي من هذه المسارات

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.patch("/update", cartController.updateQuantity);
router.delete("/remove/:productId", cartController.removeItem);
router.delete("/clear", cartController.clearCart);

module.exports = router;
