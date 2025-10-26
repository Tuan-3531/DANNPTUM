const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const app = express();
const PORT = 3000;

// Kết nối MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: Lấy danh sách sản phẩm
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API: Lấy chi tiết sản phẩm theo id
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// API: Cập nhật sản phẩm
app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API: Xóa sản phẩm
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API: Thêm sản phẩm (tạm thời cho admin test)
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🌐 Server đang chạy tại http://localhost:${PORT}`);
});
