import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // استخراج التوكن
      token = req.headers.authorization.split(" ")[1];
      console.log('Received token:', token ? 'توكن موجود' : 'لا يوجد توكن');

      // فك التوكن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', decoded.id);

      // جلب بيانات اليوزر من الـ DB (بدون الباسورد)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.log('User not found in database');
        return res.status(401).json({ message: "User not found" });
      }

      console.log('User authenticated successfully:', req.user.email);
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log('No authorization header found');
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};
