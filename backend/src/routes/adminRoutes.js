const express = require("express");
const router = express.Router();
const { 
  changePassword,
  updateFare,
  getFare
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");

router.put("/change-password", authMiddleware, changePassword);

router.put("/update-fare", authMiddleware, updateFare);

router.get("/get-fare", authMiddleware, getFare);

module.exports = router;
