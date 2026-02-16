const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(
  cors({
origin: function (origin, callback) {
  if (!origin) return callback(null, true);

  if (/^http:\/\/localhost:\d+$/.test(origin)) {
    return callback(null, true);
  }

  callback(new Error("Not allowed by CORS"));
}

    credentials: true,
  })
);

app.use(express.json());

app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
