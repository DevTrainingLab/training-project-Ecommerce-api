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
  getTotalSales,
} = require("../controllers/order.controller");

const { protect, admin } = require("../middlewares/auth.middleware");

// ── Static routes FIRST (before /:id) ────────────────────────────
router.get("/total-sales", protect, admin, getTotalSales); // ✅ فوق /:id
router.get("/my", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.post("/", protect, createOrder);

// ── Dynamic routes AFTER ──────────────────────────────────────────
router.get("/:id", protect, admin, getOrderById);
router.put("/:id", protect, admin, updateOrder);
router.put("/:id/deliver", protect, admin, updateDeliveryStatus);
router.put("/:id/pay", protect, admin, updatePaymentStatus);
router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;
