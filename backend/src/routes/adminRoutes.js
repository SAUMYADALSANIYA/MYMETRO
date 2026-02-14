const express = require("express");
const router = express.Router();
const { changePassword } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

router.put("/change-password", authMiddleware, changePassword);

module.exports = router;
