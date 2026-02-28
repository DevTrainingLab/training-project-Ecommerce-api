const Order = require("../models/order.model");
const Cart  = require("../models/cart.model");

// ── Create Order ──────────────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, subtotal, discount, total } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      product:  item.product._id,
      title:    item.product.title,
      price:    item.product.price,
      quantity: item.quantity,
      image:    item.product.images?.[0],
    }));

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      discount,
      total,
    });

    // Clear cart after order created
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get My Orders ─────────────────────────────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get Order By ID ───────────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "firstName email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get All Orders (Admin) ────────────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "firstName email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Update Delivery Status (Admin) ────────────────────────────────
const updateDeliveryStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isDelivered  = req.body.isDelivered ?? !order.isDelivered;
    order.deliveredAt  = order.isDelivered ? new Date() : null;

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Update Payment Status (Admin) ─────────────────────────────────
const updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isPaid     = req.body.isPaid ?? !order.isPaid;
    order.paidAt     = order.isPaid ? new Date() : null;
    if (req.body.paymentMethod) order.paymentMethod = req.body.paymentMethod;

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Update Order (Admin) - delivery + payment in one call ─────────
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { isPaid, isDelivered, paymentMethod } = req.body;

    if (typeof isPaid !== "undefined") {
      order.isPaid  = isPaid;
      order.paidAt  = isPaid ? new Date() : null;
    }

    if (typeof isDelivered !== "undefined") {
      order.isDelivered = isDelivered;
      order.deliveredAt = isDelivered ? new Date() : null;
    }

    if (paymentMethod) order.paymentMethod = paymentMethod;

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Delete Order (Admin) ──────────────────────────────────────────
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateDeliveryStatus,
  updatePaymentStatus,
  updateOrder,
  deleteOrder,
};