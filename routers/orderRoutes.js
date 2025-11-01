const express = require("express");
const router = express.Router();
const { createOrder, getOrders, cancelOrder } = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/:userId", getOrders);
router.delete("/:orderId", cancelOrder);

module.exports = router;
