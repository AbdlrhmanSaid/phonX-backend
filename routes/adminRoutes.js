// routes/adminRoutes.js
import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  // Overview
  getAdminOverview,
  getSalesReport,

  // Users
  listUsers,
  getUserByIdAdmin,
  updateUserAdmin,
  deleteUserAdmin,

  // Categories
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,

  // Products
  listProductsAdmin,
  getProductByIdAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  applyDiscountToCategory,
  removeDiscountFromCategory,

  // Orders
  listOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderAdmin,
  deleteOrderAdmin,

  // Appointments
  listAppointmentsAdmin,
  getAppointmentByIdAdmin,
  updateAppointmentAdmin,
  deleteAppointmentAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

// كل راوت تحت حماية الأدمن
router.use(protect, adminOnly);

/* Overview & Reports */
router.get("/overview", getAdminOverview);
router.get("/reports/sales", getSalesReport);

/* Users */
router.get("/users", listUsers);
router.get("/users/:id", getUserByIdAdmin);
router.put("/users/:id", updateUserAdmin);
router.delete("/users/:id", deleteUserAdmin);

/* Categories */
router.get("/categories", listCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

/* Products */
router.get("/products", listProductsAdmin);
router.get("/products/:id", getProductByIdAdmin);
router.post("/products", createProductAdmin);
router.put("/products/:id", updateProductAdmin);
router.delete("/products/:id", deleteProductAdmin);
router.post("/products/discount/category/:categoryId", applyDiscountToCategory);
router.delete(
  "/products/discount/category/:categoryId",
  removeDiscountFromCategory
);

/* Orders */
router.get("/orders", listOrdersAdmin);
router.get("/orders/:id", getOrderByIdAdmin);
router.put("/orders/:id", updateOrderAdmin);
router.delete("/orders/:id", deleteOrderAdmin);

/* Appointments */
router.get("/appointments", listAppointmentsAdmin);
router.get("/appointments/:id", getAppointmentByIdAdmin);
router.put("/appointments/:id", updateAppointmentAdmin);
router.delete("/appointments/:id", deleteAppointmentAdmin);

export default router;
