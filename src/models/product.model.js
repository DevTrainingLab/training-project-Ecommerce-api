const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    images: [String],
    colors: [
      {
        name: String,
        hex: String,
      },
    ],
    sizes: [
      {
        size: String,
        stock: Number,
      },
    ],
    totalStock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
  { bufferCommands: false }
);

module.exports = mongoose.model("Product", productSchema);
