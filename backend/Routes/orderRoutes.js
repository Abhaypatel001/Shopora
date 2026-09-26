const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../Controllers/orderController");

const {
  protect,
  adminOnly,
} = require("../Middleware/authMiddleware");

const router = express.Router();

// ==========================================
// USER ORDERS
// ==========================================

router.post(
  "/",
  protect,
  createOrder
);

router.get(
  "/",
  protect,
  getMyOrders
);


// ==========================================
// ADMIN ORDERS
// ==========================================

// Get all orders
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllOrders
);

// Update order status
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);


// ==========================================
// SINGLE USER ORDER
// ==========================================

router.get(
  "/:id",
  protect,
  getOrderById
);

module.exports = router;