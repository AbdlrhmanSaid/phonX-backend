import express from "express";
import {
  createOrder,
  getUserOrders,
  getUserOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder, // ✅ أضفنا حذف الأوردر
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🛒 إنشاء أوردر (من الكارت أو شراء سريع)
router.post("/", protect, createOrder);

// 📦 جلب كل أوردرات المستخدم
router.get("/my-orders", protect, getUserOrders);

// 📦 جلب أوردر محدد للمستخدم
router.get("/my-orders/:id", protect, getUserOrderById);

// 📝 جلب كل الأوردرات (Admin)
router.get("/", protect, adminOnly, getAllOrders);

// 🔄 تعديل حالة أوردر (Admin)
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

// ❌ حذف أوردر (Admin)
router.delete("/:id", protect, adminOnly, deleteOrder);

export default router;
