const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = "Tuandeptraibodoiqua";

exports.verifyToken = (req, res) => {
  res.json({ valid: true, user: req.user });
};

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "Đăng ký thành công", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Sai tên đăng nhập" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Đăng nhập thành công", token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
