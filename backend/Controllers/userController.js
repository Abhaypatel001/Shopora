const User = require("../Models/User");
const mongoose = require("mongoose");


// ==========================================
// ADMIN - GET ALL USERS
// ==========================================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });

  } catch (error) {
    console.error(
      "Get all users error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};


// ==========================================
// ADMIN - UPDATE USER ROLE
// ==========================================
const updateUserRole = async (
  req,
  res
) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    if (
      req.userId.toString() ===
      req.params.id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot change your own role",
      });
    }

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        { role },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message:
        "User role updated successfully",
      user,
    });

  } catch (error) {
    console.error(
      "Update user role error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update user role",
    });
  }
};


// ==========================================
// GET MY ADDRESSES
// ==========================================
const getMyAddresses = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.userId
    ).select("addresses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      addresses: user.addresses || [],
    });

  } catch (error) {
    console.error(
      "Get addresses error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch addresses",
    });
  }
};


// ==========================================
// ADD ADDRESS
// ==========================================
const createAddress = async (
  req,
  res
) => {
  try {
    const {
      label = "Home",
      name,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault = false,
    } = req.body;

    if (
      !name?.trim() ||
      !phone?.trim() ||
      !address?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !pincode?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All address fields are required",
      });
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number must contain 10 digits",
      });
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      return res.status(400).json({
        success: false,
        message:
          "PIN code must contain 6 digits",
      });
    }

    const user = await User.findById(
      req.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const shouldBeDefault =
      user.addresses.length === 0 ||
      Boolean(isDefault);

    if (shouldBeDefault) {
      user.addresses.forEach(
        (item) => {
          item.isDefault = false;
        }
      );
    }

    user.addresses.push({
      label: ["Home", "Work", "Other"].includes(
        label
      )
        ? label
        : "Other",

      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      isDefault: shouldBeDefault,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });

  } catch (error) {
    console.error(
      "Create address error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to add address",
    });
  }
};


// ==========================================
// UPDATE ADDRESS
// ==========================================
const updateAddress = async (
  req,
  res
) => {
  try {
    const {
      label = "Home",
      name,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault = false,
    } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.addressId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    if (
      !name?.trim() ||
      !phone?.trim() ||
      !address?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !pincode?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All address fields are required",
      });
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number must contain 10 digits",
      });
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      return res.status(400).json({
        success: false,
        message:
          "PIN code must contain 6 digits",
      });
    }

    const user = await User.findById(
      req.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const addressItem =
      user.addresses.id(
        req.params.addressId
      );

    if (!addressItem) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    if (isDefault) {
      user.addresses.forEach(
        (item) => {
          item.isDefault = false;
        }
      );
    }

    addressItem.label =
      ["Home", "Work", "Other"].includes(
        label
      )
        ? label
        : "Other";

    addressItem.name = name.trim();
    addressItem.phone = phone.trim();
    addressItem.address = address.trim();
    addressItem.city = city.trim();
    addressItem.state = state.trim();
    addressItem.pincode = pincode.trim();

    if (isDefault) {
      addressItem.isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message:
        "Address updated successfully",
      addresses: user.addresses,
    });

  } catch (error) {
    console.error(
      "Update address error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update address",
    });
  }
};


// ==========================================
// DELETE ADDRESS
// ==========================================
const deleteAddress = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.addressId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const user = await User.findById(
      req.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const addressItem =
      user.addresses.id(
        req.params.addressId
      );

    if (!addressItem) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault =
      addressItem.isDefault;

    addressItem.deleteOne();

    if (
      wasDefault &&
      user.addresses.length > 0
    ) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message:
        "Address deleted successfully",
      addresses: user.addresses,
    });

  } catch (error) {
    console.error(
      "Delete address error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete address",
    });
  }
};


// ==========================================
// SET DEFAULT ADDRESS
// ==========================================
const setDefaultAddress = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.addressId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const user = await User.findById(
      req.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const addressItem =
      user.addresses.id(
        req.params.addressId
      );

    if (!addressItem) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    user.addresses.forEach(
      (item) => {
        item.isDefault =
          item._id.toString() ===
          req.params.addressId;
      }
    );

    await user.save();

    res.json({
      success: true,
      message:
        "Default address updated",
      addresses: user.addresses,
    });

  } catch (error) {
    console.error(
      "Set default address error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to set default address",
    });
  }
};
// ==========================================
// GET MY PROFILE
// ==========================================
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .populate(
        "wishlist",
        "name category price oldPrice rating reviews image"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load profile",
    });
  }
};


// ==========================================
// UPDATE MY PROFILE
// ==========================================
const updateMyProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name.trim();

    await user.save();

    const safeUser = await User.findById(user._id).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};


// ==========================================
// CHANGE PASSWORD
// ==========================================
const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both passwords are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch =
      await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};


// ==========================================
// GET WISHLIST
// ==========================================
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("wishlist")
      .populate(
        "wishlist",
        "name category price oldPrice rating reviews image stock"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      wishlist: user.wishlist || [],
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load wishlist",
    });
  }
};


// ==========================================
// ADD TO WISHLIST
// ==========================================
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const Product = require("../models/Product");

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyAdded = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (alreadyAdded) {
      return res.json({
        success: true,
        message: "Product already in wishlist",
        wishlist: user.wishlist,
      });
    }

    user.wishlist.push(product._id);

    await user.save();

    res.json({
      success: true,
      message: "Added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
    });
  }
};


// ==========================================
// REMOVE FROM WISHLIST
// ==========================================
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.wishlist =
      user.wishlist.filter(
        (id) => id.toString() !== productId
      );

    await user.save();

    res.json({
      success: true,
      message: "Removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error(
      "Remove wishlist error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
    });
  }
};


module.exports = {
  getAllUsers,
  updateUserRole,

  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getMyProfile,
  updateMyProfile,
  changePassword,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};