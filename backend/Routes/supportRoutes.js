const express = require("express");

const {
  createTicket,
  getMyTickets,
  getMyTicketById,
  getAllTickets,
  updateTicket,
} = require("../Controllers/supportController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// USER
// ==========================================

// Create support ticket
router.post(
  "/",
  protect,
  createTicket
);

// My tickets
router.get(
  "/my",
  protect,
  getMyTickets
);

// Single ticket
router.get(
  "/my/:id",
  protect,
  getMyTicketById
);


// ==========================================
// ADMIN
// ==========================================

// All tickets
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllTickets
);

// Update ticket
router.patch(
  "/admin/:id",
  protect,
  adminOnly,
  updateTicket
);

module.exports = router;