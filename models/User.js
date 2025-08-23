import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
      required: function () {
        return this.provider === "local";
      },
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, sparse: true },
    image: { type: String },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshTokens: [
      { token: String, createdAt: { type: Date, default: Date.now } },
    ],
    // معلومات العنوان
    governorate: {
      type: String,
      trim: true,
    },
    region: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // تشفير كلمة المرور فقط إذا كانت موجودة ولم يتم تشفيرها من قبل
  if (this.password && this.provider === "local") {
    // التحقق من أن كلمة المرور لم يتم تشفيرها بالفعل
    const saltRounds = 10;
    const saltPattern = new RegExp(`^\\$2[aby]\\$${saltRounds}\\$`);

    if (!saltPattern.test(this.password)) {
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
