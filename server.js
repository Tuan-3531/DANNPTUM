const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Cho phép đọc dữ liệu JSON
app.use(express.json());

// Chỉ định thư mục tĩnh để phục vụ client
app.use(express.static(path.join(__dirname, 'public')));

// API: Lấy danh sách sản phẩm
app.get('/api/products', (req, res) => {
    const data = fs.readFileSync('./data/products.json', 'utf8');
    const products = JSON.parse(data);
    res.json(products);
});

// API: Lấy chi tiết sản phẩm theo id
app.get('/api/products/:id', (req, res) => {
    const data = fs.readFileSync('./data/products.json', 'utf8');
    const products = JSON.parse(data);
    const product = products.find(p => p.id == req.params.id);
    res.json(product || { message: 'Không tìm thấy sản phẩm' });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
