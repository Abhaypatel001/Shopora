const SupportTicket = require("../Models/SupportTicket");
const mongoose = require("mongoose");

// ==========================================
// CREATE SUPPORT TICKET
// ==========================================
const createTicket = async (req, res) => {
  try {
    const {
      name,
      email,
      category,
      subject,
      message,
      priority = "Medium",
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!subject?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const allowedCategories = [
      "Order Support",
      "Returns & Refunds",
      "Payments",
      "Account Help",
      "Product Issue",
      "Other",
    ];

    const allowedPriorities = [
      "Low",
      "Medium",
      "High",
    ];

    const finalCategory =
      allowedCategories.includes(category)
        ? category
        : "Other";

    const finalPriority =
      allowedPriorities.includes(priority)
        ? priority
        : "Medium";

    const ticket =
      await SupportTicket.create({
        user: req.userId || null,

        name: name.trim(),
        email: email.trim(),

        category: finalCategory,
        subject: subject.trim(),
        message: message.trim(),

        priority: finalPriority,

        status: "Open",
      });

    res.status(201).json({
      success: true,
      message:
        "Support request submitted successfully",
      ticket,
    });
  } catch (error) {
    console.error(
      "Create support ticket error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to submit support request",
    });
  }
};


// ==========================================
// GET MY TICKETS
// ==========================================
const getMyTickets = async (req, res) => {
  try {
    const tickets =
      await SupportTicket.find({
        user: req.userId,
      }).sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error(
      "Get my tickets error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch support tickets",
    });
  }
};


// ==========================================
// GET SINGLE MY TICKET
// ==========================================
const getMyTicketById = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
    }

    const ticket =
      await SupportTicket.findOne({
        _id: req.params.id,
        user: req.userId,
      });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error(
      "Get support ticket error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch support ticket",
    });
  }
};


// ==========================================
// ADMIN - GET ALL TICKETS
// ==========================================
const getAllTickets = async (
  req,
  res
) => {
  try {
    const tickets =
      await SupportTicket.find()
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error(
      "Get all support tickets error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch support tickets",
    });
  }
};


// ==========================================
// ADMIN - UPDATE TICKET
// ==========================================
const updateTicket = async (
  req,
  res
) => {
  try {
    const {
      status,
      priority,
      adminReply,
    } = req.body;

    const allowedStatuses = [
      "Open",
      "In Progress",
      "Resolved",
      "Closed",
    ];

    const allowedPriorities = [
      "Low",
      "Medium",
      "High",
    ];

    if (
      status &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (
      priority &&
      !allowedPriorities.includes(priority)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
    }

    const updateData = {};

    if (status) {
      updateData.status = status;
    }

    if (priority) {
      updateData.priority = priority;
    }

    if (
      typeof adminReply === "string"
    ) {
      updateData.adminReply =
        adminReply.trim();

      updateData.repliedAt =
        adminReply.trim()
          ? new Date()
          : null;
    }

    const ticket =
      await SupportTicket.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "user",
        "name email"
      );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message:
          "Support ticket not found",
      });
    }

    res.json({
      success: true,
      message:
        "Support ticket updated successfully",
      ticket,
    });
  } catch (error) {
    console.error(
      "Update support ticket error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update support ticket",
    });
  }
};


module.exports = {
  createTicket,
  getMyTickets,
  getMyTicketById,
  getAllTickets,
  updateTicket,
};
