import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import Category from "../models/Category.js";

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
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

// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      categoryId,
      stock,
      images,
      hasDiscount,
      discountPrice,
    } = req.body;

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can create products" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let uploadedImages = [];
    if (images && Array.isArray(images)) {
      uploadedImages = images.map((url) => ({
        url,
        public_id: null,
      }));
    }
    if (req.files && req.files.length > 0) {
      const uploads = req.files.map((file) => uploadToCloudinary(file));
      const results = await Promise.all(uploads);
      uploadedImages = uploadedImages.concat(results);
    }

    const product = new Product({
      name,
      price,
      description,
      stock: stock || 0,
      category: categoryId,
      images: uploadedImages,
      hasDiscount: hasDiscount || false,
      discountPrice: hasDiscount ? discountPrice : null,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Product

// ✅ Apply Discount to Category
export const applyDiscountToCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { discountPrice } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // تحديث كل المنتجات الخاصة بالفئة
    const result = await Product.updateMany(
      { category: categoryId, price: { $gt: discountPrice } },
      { $set: { hasDiscount: true, discountPrice } }
    );

    res.json({
      message: `Discount applied to ${result.modifiedCount} products in category ${category.name}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Products (مع فلترة و بحث)
export const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, isActive } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category; // لازم يكون ObjectId
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const products = await Product.find(filter).populate(
      "category",
      "name description"
    );

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name description"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("category", "name description");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Product (مع مسح الصور من Cloudinary)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
