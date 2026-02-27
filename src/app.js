const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const categoryRoutes = require("./routes/category.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the E-commerce API!" });
});
app.use("/api", (req, res) => {
  res.status(200).json({ message: "API is running!" });
});
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
