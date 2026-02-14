const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

const { protect, admin } = require("../middlewares/auth.middleware");

router.post("/", protect, orderController.createOrder);
router.get("/my", protect, orderController.getMyOrders);
router.get("/:id", protect, orderController.getOrderById);
router.get("/", protect, admin, orderController.getAllOrders);

module.exports = router;
