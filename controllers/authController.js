import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";

const generateToken = (id, role, expiresIn = "30m") =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn });

export const register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    // البحث عن المستخدم بالبريد الإلكتروني
    const userExists = await User.findOne({ email });
    if (userExists) {
      // تحقق من نوع الحساب الموجود
      if (userExists.provider === "google") {
        return res.status(400).json({
          message:
            "يوجد حساب مسجل بهذا البريد الإلكتروني عبر جوجل. يرجى تسجيل الدخول بجوجل أو استخدام بريد إلكتروني مختلف.",
          provider: "google",
        });
      } else {
        return res.status(400).json({
          message:
            "يوجد حساب مسجل بهذا البريد الإلكتروني. يرجى تسجيل الدخول أو استخدام بريد إلكتروني مختلف.",
          provider: "local",
        });
      }
    }

    // التحقق من رقم الهاتف إذا تم توفيره
    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({
          message: "رقم الهاتف مستخدم بالفعل. يرجى استخدام رقم هاتف مختلف.",
        });
      }
    }

    const user = await User.create({ name, email, phone, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      provider: user.provider,
      token: generateToken(user._id, user.role),
      refreshToken: generateToken(user._id, user.role, "7d"),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    // تحقق من نوع الحساب
    if (user.provider === "google") {
      return res.status(401).json({
        message: "هذا الحساب مسجل عبر جوجل. يرجى تسجيل الدخول بجوجل.",
        provider: "google",
      });
    }

    // تحقق من وجود كلمة المرور
    if (!user.password) {
      return res.status(401).json({
        message:
          "هذا الحساب لا يحتوي على كلمة مرور. يرجى تسجيل الدخول بجوجل أو إعادة تعيين كلمة المرور.",
        provider: "google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      provider: user.provider,
      token: generateToken(user._id, user.role),
      refreshToken: generateToken(user._id, user.role, "7d"),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "No refresh token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      token: generateToken(user._id, user.role),
      refreshToken: generateToken(user._id, user.role, "7d"),
    });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save();

  res.json({ message: "Reset token generated", resetToken });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};
