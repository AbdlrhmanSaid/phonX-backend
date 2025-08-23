import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const updateProfile = async (req, res) => {
  try {
    console.log("Update profile request received for user:", req.user._id);
    console.log("Request body:", req.body);

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("Current user data:", {
      name: user.name,
      email: user.email,
      phone: user.phone,
      provider: user.provider,
    });

    const {
      name,
      email,
      phone,
      password,
      oldPassword,
      governorate,
      region,
      address,
    } = req.body;

    // التحقق من صحة البيانات
    if (name && name.trim().length < 3) {
      return res.status(400).json({
        message: "الاسم يجب أن يكون 3 أحرف على الأقل",
      });
    }

    if (phone && !/^01[0-9]{9}$/.test(phone)) {
      return res.status(400).json({
        message: "رقم الهاتف غير صحيح. يجب أن يكون 11 رقم يبدأ بـ 01",
      });
    }

    if (password && password.length < 6) {
      return res.status(400).json({
        message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      });
    }

    // تحديث البيانات الأساسية
    if (name) {
      user.name = name.trim();
      console.log("Updated name to:", user.name);
    }
    if (email) {
      user.email = email.toLowerCase().trim();
      console.log("Updated email to:", user.email);
    }
    if (phone) {
      user.phone = phone;
      console.log("Updated phone to:", user.phone);
    }
    if (governorate) {
      user.governorate = governorate.trim();
      console.log("Updated governorate to:", user.governorate);
    }
    if (region) {
      user.region = region.trim();
      console.log("Updated region to:", user.region);
    }
    if (address) {
      user.address = address.trim();
      console.log("Updated address to:", user.address);
    }

    // منطق تحديث كلمة المرور
    if (password) {
      if (user.provider === "local" && user.password) {
        // مستخدم محلي → لازم يدخل الباسورد القديمة
        if (!oldPassword) {
          return res.status(400).json({
            message: "كلمة المرور القديمة مطلوبة لتغيير كلمة المرور",
          });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({
            message: "كلمة المرور القديمة غير صحيحة",
          });
        }
      } else if (user.provider === "google") {
        // مستخدم جوجل → لا يحتاج كلمة مرور قديمة
        console.log("Google user adding password - no old password required");
      }

      // مستخدم Google أو Local مع كلمة مرور قديمة صحيحة
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.provider = "local"; // لو كان google يتحول لـ local
      console.log("Updated password and provider to local");
    }

    console.log("Saving user with data:", {
      name: user.name,
      email: user.email,
      phone: user.phone,
      provider: user.provider,
    });

    try {
      const updatedUser = await user.save();
      console.log("User saved successfully:", updatedUser._id);

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        governorate: updatedUser.governorate,
        region: updatedUser.region,
        address: updatedUser.address,
        provider: updatedUser.provider,
      });
    } catch (error) {
      console.error("Save error:", error);
      if (error.code === 11000 && error.keyValue.phone) {
        return res.status(400).json({
          message: "رقم الهاتف مستخدم بالفعل",
        });
      }
      if (error.code === 11000 && error.keyValue.email) {
        return res.status(400).json({
          message: "البريد الإلكتروني مستخدم بالفعل",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: error.message });
  }
};
