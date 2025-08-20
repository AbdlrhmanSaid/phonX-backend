import User from "../models/User.js";
import bcrypt from "bcryptjs";

// 🟢 عرض كل المستخدمين (أدمن فقط)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 عرض يوزر واحد
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 تحديث يوزر (أدمن فقط)
export const updateUser = async (req, res) => {
  try {
    const { name, phone, email, governorate, region, address, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.email = email || user.email;
    user.governorate = governorate || user.governorate;
    user.region = region || user.region;
    user.address = address || user.address;
    if (role) user.role = role; // الأدمن يقدر يغير الدور

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password, oldPassword, governorate, region, address } =
      req.body;

    // تحديث البيانات العادية
    user.name = name || user.name;
    user.email = email || user.email;
    user.governorate = governorate || user.governorate;
    user.region = region || user.region;
    user.address = address || user.address;

    // تحديث الباسورد (لو دخل القديمة صح)
    if (password) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Old password is incorrect" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      governorate: updatedUser.governorate,
      region: updatedUser.region,
      address: updatedUser.address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
