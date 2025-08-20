import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const generateToken = (id, role, expiresIn = "30m") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn });
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password, oldPassword, governorate, region, address } =
      req.body;

    user.name = name || user.name;
    user.email = email || user.email;
    user.governorate = governorate || user.governorate;
    user.region = region || user.region;
    user.address = address || user.address;

    let tokenNeedsUpdate = false;

    if (password) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Old password is incorrect" });

      user.password = await bcrypt.hash(password, 10);
      tokenNeedsUpdate = true;
    }

    if (email && email !== user.email) {
      tokenNeedsUpdate = true;
    }

    const updatedUser = await user.save();

    const response = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      governorate: updatedUser.governorate,
      region: updatedUser.region,
      address: updatedUser.address,
    };

    if (tokenNeedsUpdate) {
      response.token = generateToken(updatedUser._id, updatedUser.role);
      response.refreshToken = generateToken(
        updatedUser._id,
        updatedUser.role,
        "7d"
      );
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
