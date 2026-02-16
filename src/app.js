const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5172",
  "http://localhost:5173/",
  "http://localhost:5174/",
  "http://localhost:5175/",
  "http://localhost:5176/",
  "http://localhost:5177/",
  "http://localhost:5178/",
  "http://localhost:5179/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
