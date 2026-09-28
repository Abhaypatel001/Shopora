require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./Models/Product");

const products = [
  // ---------- DEALS ----------
  {
    name: "Aero Wireless Headphones with Noise Cancelling",
    category: "Electronics",
    price: 2499,
    oldPrice: 4999,
    rating: 4.5,
    reviews: 12840,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    description:
      "Wireless headphones with noise cancelling, clear sound and comfortable design.",
    stock: 50,
    section: "deals",
    sortOrder: 1,
  },

  {
    name: "Pulse Smartwatch, AMOLED Display, 7-day Battery",
    category: "Watches",
    price: 3299,
    oldPrice: 5999,
    rating: 4.3,
    reviews: 8210,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
    description:
      "Smartwatch with AMOLED display, fitness tracking and up to 7 days of battery life.",
    stock: 50,
    section: "deals",
    sortOrder: 2,
  },

  {
    name: "Nova 5G Smartphone, 128 GB, Midnight Blue",
    category: "Mobiles",
    price: 14999,
    oldPrice: 19999,
    rating: 4.4,
    reviews: 30125,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85",
    description:
      "5G smartphone with 128 GB storage and a modern midnight blue design.",
    stock: 50,
    section: "deals",
    sortOrder: 3,
  },

  {
    name: "Halo Reading Lamp with Adjustable Brightness",
    category: "Home",
    price: 699,
    oldPrice: 1299,
    rating: 4.2,
    reviews: 2760,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
    description:
      "Modern reading lamp with adjustable brightness for study and reading.",
    stock: 50,
    section: "deals",
    sortOrder: 4,
  },

  // ---------- TRENDING ----------
  {
    name: "Everyday Cotton T-Shirt, Regular Fit",
    category: "Fashion",
    price: 449,
    oldPrice: 799,
    rating: 4.1,
    reviews: 5402,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    description:
      "Comfortable everyday cotton T-shirt with a regular fit.",
    stock: 50,
    section: "trending",
    sortOrder: 1,
  },

  {
    name: "Trail Runner Sports Shoes for Men",
    category: "Footwear",
    price: 1899,
    oldPrice: 2999,
    rating: 4.4,
    reviews: 9188,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    description:
      "Lightweight sports shoes designed for comfortable everyday running and walking.",
    stock: 50,
    section: "trending",
    sortOrder: 2,
  },

  {
    name: "Urban Backpack, 25 L, Water Resistant",
    category: "Bags",
    price: 999,
    oldPrice: 1799,
    rating: 4.3,
    reviews: 6470,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    description:
      "25 litre water-resistant backpack suitable for college, travel and everyday use.",
    stock: 50,
    section: "trending",
    sortOrder: 3,
  },

  {
    name: "The Habit Loop: Build Better Routines",
    category: "Books",
    price: 299,
    oldPrice: 499,
    rating: 4.7,
    reviews: 15320,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
    description:
      "A practical book about building better routines and productive habits.",
    stock: 50,
    section: "trending",
    sortOrder: 4,
  },

  {
    name: "Bass Boost In-ear Earphones with Mic",
    category: "Audio",
    price: 599,
    oldPrice: 1199,
    rating: 4.0,
    reviews: 21980,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=85",
    description:
      "In-ear earphones with bass boost and built-in microphone.",
    stock: 50,
    section: "trending",
    sortOrder: 5,
  },

  {
    name: "Classic Analog Watch, Leather Strap",
    category: "Watches",
    price: 1299,
    oldPrice: 2499,
    rating: 4.2,
    reviews: 3340,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85",
    description:
      "Classic analog watch featuring a stylish leather strap.",
    stock: 50,
    section: "trending",
    sortOrder: 6,
  },

  {
    name: "Linen Blend Casual Shirt, Slim Fit",
    category: "Fashion",
    price: 899,
    oldPrice: 1599,
    rating: 4.1,
    reviews: 1980,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    description:
      "Comfortable linen blend casual shirt with a modern slim fit.",
    stock: 50,
    section: "trending",
    sortOrder: 7,
  },

  {
    name: "Compact Crossbody Bag for Everyday Use",
    category: "Bags",
    price: 749,
    oldPrice: 0,
    rating: 4.5,
    reviews: 1120,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
    description:
      "Compact crossbody bag designed for convenient everyday carrying.",
    stock: 50,
    section: "trending",
    sortOrder: 8,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected ✅");

    for (const product of products) {
      await Product.findOneAndUpdate(
        { name: product.name },
        product,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log(`✔ ${product.name}`);
    }

    console.log("\n🎉 All Shopora products seeded successfully!");

    const count = await Product.countDocuments();

    console.log(`Total products in MongoDB: ${count}`);

    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("❌ Seed error:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedProducts();