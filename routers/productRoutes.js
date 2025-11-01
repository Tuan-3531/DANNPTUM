const express = require("express");
const router = express.Router();
const { getAll, getById, create, update, remove } = require("../controllers/productController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authenticateToken, isAdmin, create);
router.put("/:id", authenticateToken, isAdmin, update);
router.delete("/:id", authenticateToken, isAdmin, remove);

module.exports = router;
