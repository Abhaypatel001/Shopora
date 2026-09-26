const express = require("express");

const {
  searchExternalProducts,
} = require("../Controllers/externalProductController");

const router = express.Router();

router.get(
  "/search",
  searchExternalProducts
);

module.exports = router;