const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  deleteCategory,
} = require("../controllers/category.controller");
const { admin, protect } = require("../middlewares/auth.middleware");
router.post("/", protect, admin, createCategory);
router.get("/", getCategories);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
