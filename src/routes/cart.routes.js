const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.patch("/update", cartController.updateQuantity);
router.delete("/remove/:productId", cartController.removeItem);
router.delete("/clear", cartController.clearCart);

module.exports = router;
