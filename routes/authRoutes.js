import express from "express";
import { body } from "express-validator";
import validateRequest from "../middleware/validateRequest.js";
import { authLimiter } from "../middleware/rateLimiter.js";

import {
  register,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../controllers/authController.js";
import { googleAuth } from "../controllers/googleAuthController.js";

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  ],
  validateRequest,
  register
);

router.post("/login", authLimiter, login);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/google", googleAuth);

export default router;
