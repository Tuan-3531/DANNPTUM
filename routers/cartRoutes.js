const express = require("express");
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require("../controllers/cartController");

router.get("/:userId", getCart);
router.post("/", addToCart);
router.delete("/:userId/:productId", removeFromCart);

module.exports = router;
