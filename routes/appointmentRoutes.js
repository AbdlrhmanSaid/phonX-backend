import express from "express";
import {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer(); // للملفات (multipart/form-data)

// إنشاء حجز مع رفع صور
router.post("/", protect, upload.array("images"), createAppointment);

// جلب كل حجوزات المستخدم
router.get("/my-appointments", protect, getUserAppointments);

// جلب حجز معين
router.get("/my-appointments/:id", protect, getAppointmentById);

// تعديل حالة الحجز (Admin)
router.put("/:id/status", protect, adminOnly, updateAppointmentStatus);

// حذف الحجز
router.delete("/:id", protect, adminOnly, deleteAppointment);

export default router;
