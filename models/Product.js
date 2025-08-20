import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // 🔗 الربط مع الكاتيجوري
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String },
      },
    ],

    hasDiscount: {
      type: Boolean,
      default: false,
    },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return !this.hasDiscount || value < this.price;
        },
        message: "Discount price must be lower than original price",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
