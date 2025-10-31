const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Webbanhang', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Kết nối MongoDB thành công!');
  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error);
  }
}

module.exports = connectDB;
