const express = require("express");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
const PORT = 3000;

connectDB();
app.use(express.json());

// Import routes
const authRoutes = require("./routers/authRoutes");
const productRoutes = require("./routers/productRoutes");
const cartRoutes = require("./routers/cartRoutes");
const orderRoutes = require("./routers/orderRoutes");

// Sử dụng router
app.use("/api", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Phục vụ file tĩnh
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
