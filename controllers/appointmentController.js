import Appointment from "../models/Appointment.js";
import cloudinary from "../config/cloudinary.js";

// رفع صورة واحدة على Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "appointments" },
      (error, result) => {
        if (error) reject(error);
        else
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
      }
    );
    stream.end(file.buffer);
  });
};

// ✅ إنشاء حجز
export const createAppointment = async (req, res) => {
  try {
    const { serviceType, date, notes } = req.body;
    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      const uploads = req.files.map((file) => uploadToCloudinary(file));
      uploadedImages = await Promise.all(uploads);
    }

    const appointment = new Appointment({
      user: req.user._id,
      serviceType,
      date,
      notes,
      images: uploadedImages,
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ جلب كل الحجوزات الخاصة بالمستخدم
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ جلب حجز معين
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Access denied" });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ تعديل حالة الحجز (Admin)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.status = status || appointment.status;
    await appointment.save();

    res.json({
      message: "Appointment status updated",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ حذف حجز
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    // حذف الصور من Cloudinary
    for (const img of appointment.images) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
    }

    await appointment.deleteOne();

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
