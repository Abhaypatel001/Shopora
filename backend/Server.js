require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db");
const externalProductRoutes = require(
  "./Routes/externalProductRoutes"
);
const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());
app.use("/api/auth", require("./Routes/authRoutes"));
app.use("/api/orders", require("./Routes/orderRoutes"));

app.use(
  "/api/products",
  require("./Routes/productRoutes")
);
app.use("/api/users", require("./Routes/userRoutes"));
app.use(
  "/api/support",
  require("./Routes/supportRoutes")
);
app.use(
  "/api/external-products",
  externalProductRoutes
);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Shopora API is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;




app.listen(PORT, () => {
  console.log(`Shopora backend running on http://localhost:${PORT}`);
});