const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;
    const newOrder = new Order({ user: userId, items, totalAmount, status: "Đang xử lý" });
    await newOrder.save();
    res.status(201).json({ message: "Đặt hàng thành công!", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    if (order.status === "Đã hủy") return res.status(400).json({ message: "Đơn hàng đã bị hủy" });

    order.status = "Đã hủy";
    await order.save();
    res.json({ message: "Hủy đơn thành công", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
