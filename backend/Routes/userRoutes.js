const express = require("express");

const {
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
} = require("../Controllers/userController");

const {
  protect,
  adminOnly,
} = require("../Middleware/authMiddleware");

const router = express.Router();


// ==========================================
// USER ADDRESS ROUTES
// ==========================================

router.get(
  "/addresses",
  protect,
  getMyAddresses
);

router.post(
  "/addresses",
  protect,
  createAddress
);

router.put(
  "/addresses/:addressId",
  protect,
  updateAddress
);

router.delete(
  "/addresses/:addressId",
  protect,
  deleteAddress
);

router.patch(
  "/addresses/:addressId/default",
  protect,
  setDefaultAddress
);
router.get("/me", protect, getMyProfile);

router.put(
  "/me",
  protect,
  updateMyProfile
);

router.patch(
  "/me/password",
  protect,
  changePassword
);

router.get(
  "/wishlist",
  protect,
  getWishlist
);

router.post(
  "/wishlist/:productId",
  protect,
  addToWishlist
);

router.delete(
  "/wishlist/:productId",
  protect,
  removeFromWishlist
);

// ==========================================
// ADMIN USER ROUTES
// ==========================================

router.get(
  "/",
  protect,
  adminOnly,
  getAllUsers
);

router.patch(
  "/:id/role",
  protect,
  adminOnly,
  updateUserRole
);

module.exports = router;