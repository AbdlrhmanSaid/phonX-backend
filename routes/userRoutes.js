import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
  checkProfileCompletion,
} from "../controllers/userController.js";
import User from "../models/User.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

// روت تحديث البروفايل
router.put("/profile/me", protect, updateProfile);

// روت فحص حالة إكمال الملف الشخصي
router.get("/profile/completion", protect, checkProfileCompletion);

// روت جلب بيانات البروفايل
router.get("/profile/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshTokens"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      provider: user.provider,
      image: user.image,
      governorate: user.governorate,
      region: user.region,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
