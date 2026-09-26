const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    oldPrice: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      default: "",
    },
    
    imagePublicId: {
  type: String,
  default: "",
},

    description: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    section: {
  type: String,
  enum: ["deals", "trending"],
  default: "trending",
},

sortOrder: {
  type: Number,
  default: 0,
},
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
