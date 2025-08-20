import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 متاحة للجميع
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// 📌 للأدمن فقط
router.post("/", protect, adminOnly, createCategory);
router.put("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
