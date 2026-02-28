const Product = require("../models/product.model");
const Category = require("../models/category.model");
const mongoose = require("mongoose");

// ── Helper: find category by _id OR slug ──────────────────────────
const findCategory = async (value) => {
  if (!value) return null;
  // If it looks like a MongoDB ObjectId → find by _id
  if (mongoose.Types.ObjectId.isValid(value)) {
    return await Category.findById(value);
  }
  // Otherwise treat as slug
  return await Category.findOne({ slug: value });
};

// ── Create Product ────────────────────────────────────────────────
exports.createProduct = async (req, res) => {
  try {
    const { category, ...rest } = req.body;

    const categoryDoc = await findCategory(category);
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const product = await Product.create({
      ...rest,
      category: categoryDoc._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── Get All Products ──────────────────────────────────────────────
exports.getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    let filter = {};

    if (category) {
      const categoryDoc = await findCategory(category);
      if (!categoryDoc) {
        return res.status(404).json({ message: "Category not found" });
      }
      filter.category = categoryDoc._id;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get Single Product ────────────────────────────────────────────
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Update Product ────────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const { category, ...rest } = req.body;
    let updateData = { ...rest };

    if (category) {
      const categoryDoc = await findCategory(category);
      if (!categoryDoc) {
        return res.status(404).json({ message: "Category not found" });
      }
      updateData.category = categoryDoc._id;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── Delete Product ────────────────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
