const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrder,
  updateDeliveryStatus,
  updatePaymentStatus,
  deleteOrder,
  getTotalSales
} = require("../controllers/order.controller");

const { protect, admin } = require("../middlewares/auth.middleware");

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", admin, protect, getOrderById);
router.get("/", protect, admin, getAllOrders);
router.get("/total-sales", protect, admin, getTotalSales);
router.put("/:id", protect, admin, updateOrder);
router.put("/:id/deliver", protect, admin, updateDeliveryStatus);
router.put("/:id/pay", protect, admin, updatePaymentStatus);
router.delete("/:id", protect, admin, deleteOrder);
module.exports = router;
