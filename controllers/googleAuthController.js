import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id, role, expiresIn = "30m") =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn });

export const googleAuth = async (req, res) => {
  const { email, name, googleId, image, phone, password } = req.body;
  try {
    // البحث عن المستخدم بواسطة googleId أولاً
    let user = await User.findOne({ googleId });

    if (user) {
      // المستخدم موجود مع googleId - تحديث البيانات إذا لزم الأمر
      if (name && user.name !== name) user.name = name;
      if (image && user.image !== image) user.image = image;
      if (phone && !user.phone) user.phone = phone;
      if (password && !user.password) {
        const bcrypt = await import("bcryptjs");
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.provider = "local"; // تحويل من جوجل إلى محلي
      }
      await user.save();
    } else {
      // البحث عن المستخدم بواسطة البريد الإلكتروني
      user = await User.findOne({ email });

      if (user) {
        // المستخدم موجود بالبريد الإلكتروني ولكن ليس له googleId
        // تحقق من أن المستخدم ليس له كلمة مرور (مستخدم جوجل سابق)
        if (user.provider === "google" || !user.password) {
          // ربط الحساب بجوجل
          user.googleId = googleId;
          user.provider = "google";
          if (name) user.name = name;
          if (image) user.image = image;
          if (phone && !user.phone) user.phone = phone;
          if (password && !user.password) {
            const bcrypt = await import("bcryptjs");
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            user.provider = "local"; // تحويل من جوجل إلى محلي
          }
          await user.save();
        } else {
          // المستخدم له كلمة مرور - لا نربط الحساب تلقائياً
          return res.status(409).json({
            message:
              "يوجد حساب مسجل بهذا البريد الإلكتروني. يرجى تسجيل الدخول بكلمة المرور أو استخدام بريد إلكتروني مختلف.",
            conflict: true,
            email: user.email,
          });
        }
      } else {
        // إنشاء مستخدم جديد
        const userData = {
          name,
          email,
          googleId,
          provider: "google",
          image,
        };

        // إضافة رقم الهاتف إذا تم توفيره
        if (phone) userData.phone = phone;

        // إضافة كلمة المرور إذا تم توفيرها
        if (password) {
          const bcrypt = await import("bcryptjs");
          const salt = await bcrypt.genSalt(10);
          userData.password = await bcrypt.hash(password, salt);
          userData.provider = "local"; // إذا كان لديه باسورد فهو محلي
        }

        user = await User.create(userData);
      }
    }

    // فحص ما إذا كان المستخدم يحتاج لإكمال بياناته
    const needsProfileCompletion =
      !user.phone || !user.governorate || !user.region || !user.address;

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image: user.image,
        provider: user.provider,
        governorate: user.governorate,
        region: user.region,
        address: user.address,
      },
      token: generateToken(user._id, user.role),
      needsProfileCompletion,
      profileCompletionMessage: needsProfileCompletion
        ? "يرجى إكمال بياناتك الشخصية (رقم الهاتف والعنوان)"
        : null,
    });
  } catch (error) {
    console.error("Google backend error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
