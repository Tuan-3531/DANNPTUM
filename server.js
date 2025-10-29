const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const app = express();
const PORT = 3000;

// ✅ Kết nối MongoDB
connectDB();

// ✅ Middleware
app.use(express.json());


//
// ==================== PRODUCT ====================
//

// Lấy danh sách sản phẩm
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy chi tiết sản phẩm theo id
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật sản phẩm
app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa sản phẩm
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm sản phẩm (cho admin test)
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//
// ==================== AUTH ====================
//

// Đăng ký
app.post('/api/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: 'Đăng ký thành công', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Đăng nhập
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Sai tên đăng nhập' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: 'Sai mật khẩu' });

    res.json({ message: 'Đăng nhập thành công', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//
// ==================== CART ====================
//
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate('items.product', 'name price image');
    if (!cart) return res.status(200).json({ items: [] }); // trả về mảng trống nếu chưa có giỏ
    res.json(cart);
  } catch (err) {
    console.error('Lỗi /api/cart/:userId:', err);
    res.status(500).json({ message: err.message });
  }
});

// 🛒 Thêm sản phẩm vào giỏ hàng
app.post("/api/cart", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Thiếu thông tin userId hoặc productId" });
    }

    let cart = await Cart.findOne({ user: userId });

    // Nếu chưa có giỏ hàng thì tạo mới
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();
    res.json({ message: "Đã thêm vào giỏ hàng!", cart });

  } catch (error) {
    console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
    res.status(500).json({ message: "Lỗi server khi thêm giỏ hàng" });
  }
});

//
// ==================== ORDER ====================
//

// Đặt hàng
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Sau khi đặt hàng, xóa giỏ hàng của user
    await Cart.deleteOne({ userId: req.body.userId });

    res.json({ message: 'Đặt hàng thành công', order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//
// ==================== SERVER START ====================
//
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`🌐 Server đang chạy tại http://localhost:${PORT}`);
});
