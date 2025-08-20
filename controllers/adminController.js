// controllers/adminController.js
import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Appointment from "../models/Appointment.js";
import Category from "../models/Category.js";

/* ------------------------------- Helpers ------------------------------- */

const parsePagination = (req) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const parseSort = (req, fallback = "-createdAt") => {
  // ?sort=createdAt or ?sort=-createdAt,price
  const { sort } = req.query || {};
  if (!sort) return fallback;
  return String(sort).split(",").join(" ");
};

const toObjectId = (id) => {
  if (!id) return null;
  return mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;
};

const cleanUser = (userDoc) => {
  const obj = userDoc.toObject ? userDoc.toObject() : userDoc;
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

/* ------------------------------ Overview ------------------------------ */

export const getAdminOverview = async (req, res) => {
  try {
    const [
      usersCount,
      productsCount,
      ordersCount,
      appointmentsCount,
      salesAgg,
      last7d,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Appointment.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      // مبيعات آخر 7 أيام (daily)
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            status: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            total: { $sum: "$totalPrice" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      counts: {
        users: usersCount,
        products: productsCount,
        orders: ordersCount,
        appointments: appointmentsCount,
      },
      salesTotal: salesAgg?.[0]?.total || 0,
      last7Days: last7d, // [{_id: '2025-08-15', total: 1234, orders: 7}, ...]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------------------- Users -------------------------------- */

export const listUsers = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const sort = parseSort(req, "-createdAt");
    const { search, role } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    if (role) filter.role = role;

    const [items, total] = await Promise.all([
      User.find(filter)
        .select("-password -refreshTokens")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({
      items,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserByIdAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -refreshTokens")
      .populate([
        {
          path: "cart",
          populate: {
            path: "items.product",
            select: "name price discountPrice hasDiscount images",
          },
        },
        {
          path: "orders",
          populate: [
            {
              path: "items.product",
              select: "name price discountPrice hasDiscount images category",
            },
          ],
        },
        { path: "appointments" },
      ]);

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(cleanUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserAdmin = async (req, res) => {
  try {
    const allowed = [
      "name",
      "email",
      "phone",
      "address",
      "region",
      "governorate",
      "role",
    ];
    const payload = {};
    for (const k of allowed) if (k in req.body) payload[k] = req.body[k];

    const user = await User.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    }).select("-password -refreshTokens");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(cleanUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("_id");
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------------------ Categories ----------------------------- */

export const listCategories = async (req, res) => {
  try {
    const sort = parseSort(req, "name");
    const items = await Category.find({}).sort(sort);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const exists = await Category.findOne({ name });
    if (exists)
      return res.status(400).json({ message: "Category already exists" });

    const cat = await Category.create({ name, description });
    res.status(201).json(cat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const cat = await Category.findByIdAndUpdate(
      req.params.id,
      { ...(name && { name }), ...(description && { description }) },
      { new: true }
    );
    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json(cat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const inUse = await Product.exists({ category: req.params.id });
    if (inUse) {
      return res
        .status(400)
        .json({ message: "Cannot delete: category in use by products" });
    }
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    await cat.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------------------- Products ----------------------------- */

export const listProductsAdmin = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const sort = parseSort(req, "-createdAt");
    const { search, category, isActive, minPrice, maxPrice, hasDiscount } =
      req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category && toObjectId(category))
      filter.category = toObjectId(category);
    if (isActive !== undefined) filter.isActive = String(isActive) === "true";
    if (hasDiscount !== undefined)
      filter.hasDiscount = String(hasDiscount) === "true";
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name description")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      items,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductByIdAdmin = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id).populate(
      "category",
      "name description"
    );
    if (!prod) return res.status(404).json({ message: "Product not found" });
    res.json(prod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProductAdmin = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload.category || !toObjectId(payload.category)) {
      return res.status(400).json({ message: "Valid category is required" });
    }
    // ضمان التوافق مع hasDiscount/discountPrice
    if (
      payload.hasDiscount &&
      !(Number(payload.discountPrice) < Number(payload.price))
    ) {
      return res
        .status(400)
        .json({ message: "Discount price must be lower than original price" });
    }

    const created = await Product.create(payload);
    const populated = await Product.findById(created._id).populate(
      "category",
      "name description"
    );
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProductAdmin = async (req, res) => {
  try {
    const { hasDiscount, discountPrice, price } = req.body;
    if (hasDiscount && discountPrice !== undefined) {
      const p = price !== undefined ? Number(price) : undefined;
      if (p !== undefined && Number(discountPrice) >= p) {
        return res.status(400).json({
          message: "Discount price must be lower than original price",
        });
      }
      // لو مفيش price في البودي نقرأ السعر القديم للمقارنة
      if (p === undefined) {
        const existing = await Product.findById(req.params.id).select("price");
        if (!existing)
          return res.status(404).json({ message: "Product not found" });
        if (Number(discountPrice) >= Number(existing.price)) {
          return res.status(400).json({
            message: "Discount price must be lower than original price",
          });
        }
      }
    }

    const prod = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("category", "name description");
    if (!prod) return res.status(404).json({ message: "Product not found" });
    res.json(prod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProductAdmin = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });
    await prod.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// خصم جماعي على فئة
export const applyDiscountToCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { discountPrice } = req.body;

    const cat = await Category.findById(categoryId);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    const result = await Product.updateMany(
      { category: categoryId, price: { $gt: Number(discountPrice) } },
      { $set: { hasDiscount: true, discountPrice: Number(discountPrice) } }
    );

    res.json({
      message: `Discount applied to ${result.modifiedCount} products in ${cat.name}`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// إلغاء الخصم عن فئة
export const removeDiscountFromCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const result = await Product.updateMany(
      { category: categoryId, hasDiscount: true },
      { $set: { hasDiscount: false }, $unset: { discountPrice: "" } }
    );
    res.json({
      message: `Discount removed from ${result.modifiedCount} products`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------------------- Orders -------------------------------- */

export const listOrdersAdmin = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const sort = parseSort(req, "-createdAt");
    const { status, userId, dateFrom, dateTo, minTotal, maxTotal } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (userId && toObjectId(userId)) filter.user = toObjectId(userId);
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }
    if (minTotal || maxTotal) {
      filter.totalPrice = {};
      if (minTotal) filter.totalPrice.$gte = Number(minTotal);
      if (maxTotal) filter.totalPrice.$lte = Number(maxTotal);
    }

    const [items, total] = await Promise.all([
      Order.find(filter)
        .populate([
          { path: "user", select: "name email phone" },
          {
            path: "items.product",
            select: "name price hasDiscount discountPrice images category",
          },
        ])
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({ items, page, totalPages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderByIdAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate([
      { path: "user", select: "name email phone address region governorate" },
      {
        path: "items.product",
        select: "name price discountPrice hasDiscount images category",
      },
    ]);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderAdmin = async (req, res) => {
  try {
    const allowed = ["status", "address", "paymentMethod"];
    const payload = {};
    for (const k of allowed) if (k in req.body) payload[k] = req.body[k];

    const order = await Order.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    }).populate([
      { path: "user", select: "name email phone" },
      { path: "items.product", select: "name" },
    ]);

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrderAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    await order.deleteOne();
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------------------ Appointments ---------------------------- */

export const listAppointmentsAdmin = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const sort = parseSort(req, "-createdAt");
    const { status, userId, serviceType, dateFrom, dateTo } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (serviceType)
      filter.serviceType = { $regex: serviceType, $options: "i" };
    if (userId && toObjectId(userId)) filter.user = toObjectId(userId);
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const [items, total] = await Promise.all([
      Appointment.find(filter)
        .populate({ path: "user", select: "name email phone" })
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Appointment.countDocuments(filter),
    ]);

    res.json({ items, page, totalPages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointmentByIdAdmin = async (req, res) => {
  try {
    const app = await Appointment.findById(req.params.id).populate({
      path: "user",
      select: "name email phone",
    });
    if (!app) return res.status(404).json({ message: "Appointment not found" });
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentAdmin = async (req, res) => {
  try {
    const allowed = ["serviceType", "date", "status", "notes", "images"];
    const payload = {};
    for (const k of allowed) if (k in req.body) payload[k] = req.body[k];

    const app = await Appointment.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    }).populate({ path: "user", select: "name email phone" });
    if (!app) return res.status(404).json({ message: "Appointment not found" });
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAppointmentAdmin = async (req, res) => {
  try {
    const app = await Appointment.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Appointment not found" });
    await app.deleteOne();
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------------- Extra --------------------------------- */

// تقرير مبيعات بالتاريخ (للرسوم البيانية في الداشبورد)
export const getSalesReport = async (req, res) => {
  try {
    const { dateFrom, dateTo, groupBy = "day" } = req.query;

    const match = {
      status: { $ne: "cancelled" },
    };
    if (dateFrom || dateTo) {
      match.createdAt = {};
      if (dateFrom) match.createdAt.$gte = new Date(dateFrom);
      if (dateTo) match.createdAt.$lte = new Date(dateTo);
    }

    const dateFormat =
      groupBy === "month" ? "%Y-%m" : groupBy === "year" ? "%Y" : "%Y-%m-%d"; // default: day

    const data = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          total: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ groupBy, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
