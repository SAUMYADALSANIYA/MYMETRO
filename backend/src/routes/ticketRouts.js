import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Ticket from "../models/ticket.js";

const router = express.Router();

// GET USER TICKETS
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find({ boughtBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

export default router;