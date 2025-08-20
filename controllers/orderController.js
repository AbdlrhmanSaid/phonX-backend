import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import User from "../models/User.js"; // لو عايز تجيب عنوان من حساب المستخدم

// ✅ إنشاء أوردر (سواء من الكارت أو شراء سريع)
export const createOrder = async (req, res) => {
  try {
    const { fromCart, productId, quantity, paymentMethod, addressId, address } =
      req.body;

    let orderItems = [];
    let totalPrice = 0;
    let deliveryAddress = "";

    // 🏠 تحديد العنوان
    if (addressId) {
      const user = await User.findById(req.user._id);
      const selectedAddress = user.addresses.find(
        (a) => a._id.toString() === addressId
      );
      if (!selectedAddress)
        return res.status(404).json({ message: "Address not found" });
      deliveryAddress = selectedAddress.address;
    } else if (address) {
      deliveryAddress = address;
    } else {
      return res.status(400).json({ message: "Address is required" });
    }

    if (fromCart) {
      // شراء من الكارت
      const cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product"
      );
      if (!cart || cart.items.length === 0)
        return res.status(400).json({ message: "Cart is empty" });

      cart.items.forEach((item) => {
        orderItems.push({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        });
        totalPrice += item.quantity * item.product.price;
      });

      // فراغ الكارت بعد إنشاء الأوردر
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    } else {
      // شراء سريع لمنتج واحد
      const product = await Product.findById(productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      orderItems.push({
        product: product._id,
        quantity: quantity || 1,
        price: product.price,
      });
      totalPrice = (quantity || 1) * product.price;
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      paymentMethod: paymentMethod || "cash",
      address: deliveryAddress,
    });

    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ جلب كل أوردرات المستخدم
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.product",
      "name price images"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ جلب أوردر معين للمستخدم
export const getUserOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "name price images"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Access denied" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ جلب كل الأوردرات (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ تعديل حالة أوردر (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status || order.status;
    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ حذف أوردر (Admin)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
