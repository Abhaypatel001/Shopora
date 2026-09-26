const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

// ==========================================
// CREATE ORDER
// ==========================================
const createOrder = async (req, res) => {
  const updatedProducts = [];

  try {
    const {
      items,
      address,
      payment = "cod",
    } = req.body;

    // ----------------------------------------
    // BASIC VALIDATION
    // ----------------------------------------
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    const requiredFields = [
      "name",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    for (const field of requiredFields) {
      if (!address[field] || !String(address[field]).trim()) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    if (!["cod", "online"].includes(payment)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // ----------------------------------------
    // BUILD ORDER FROM MONGODB DATA
    // ----------------------------------------
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const { productId } = item;
      const quantity = Number(item.quantity);

      // Product ID validation
      if (!productId) {
        throw new Error("Product ID is missing");
      }

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID");
      }

      // Quantity validation
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Invalid product quantity");
      }

      // --------------------------------------
      // CHECK PRODUCT + REDUCE STOCK
      // ATOMICALLY
      // --------------------------------------
      const product = await Product.findOneAndUpdate(
        {
          _id: productId,
          stock: { $gte: quantity },
        },
        {
          $inc: {
            stock: -quantity,
          },
        },
        {
          new: true,
        }
      );

      if (!product) {
        // Check whether product exists or stock is insufficient
        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
          throw new Error("Product not found");
        }

        throw new Error(
          `${existingProduct.name} has only ${existingProduct.stock} item(s) in stock`
        );
      }

      // Keep record in case order creation fails
      updatedProducts.push({
        productId: product._id,
        quantity,
      });

      // --------------------------------------
      // PRICE COMES FROM MONGODB
      // --------------------------------------
      const itemTotal =
        Number(product.price) * quantity;

      subtotal += itemTotal;

      orderItems.push({
        productId: product._id.toString(),
        name: product.name,
        price: Number(product.price),
        quantity,
        img: product.image || "",
      });
    }

    // ----------------------------------------
    // DELIVERY
    // ----------------------------------------
    const delivery =
      subtotal >= 499 ? 0 : 49;

    const total = subtotal + delivery;

    // ----------------------------------------
    // CREATE ORDER
    // ----------------------------------------
    const order = await Order.create({
      user: req.userId,

      items: orderItems,

      subtotal,
      delivery,
      total,

      address: {
        name: address.name.trim(),
        phone: address.phone.trim(),
        address: address.address.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim(),
      },

      payment,

      status: "Placed",
    });

    // ----------------------------------------
    // SUCCESS
    // ----------------------------------------
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("Create order error:", error);

    // ========================================
    // RESTORE STOCK IF ORDER CREATION FAILS
    // ========================================
    if (updatedProducts.length > 0) {
      try {
        for (const item of updatedProducts) {
          await Product.findByIdAndUpdate(
            item.productId,
            {
              $inc: {
                stock: item.quantity,
              },
            }
          );
        }
      } catch (rollbackError) {
        console.error(
          "Stock rollback error:",
          rollbackError
        );
      }
    }

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create order",
    });
  }
};


// ==========================================
// GET MY ORDERS
// ==========================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};


// ==========================================
// GET SINGLE ORDER
// ==========================================
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error(
      "Get order error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};
// ==========================================
// ADMIN - GET ALL ORDERS
// ==========================================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
    });
  }
};


// ==========================================
// ADMIN - UPDATE ORDER STATUS
// ==========================================
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Placed",
      "Confirmed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};