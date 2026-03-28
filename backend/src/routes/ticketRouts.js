import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Ticket from "../models/ticket.js";

const router = express.Router();

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find({ boughtBy: req.user.id })
      .sort({ createdAt: -1 });

    const updatedTickets = tickets.map((t) => {
      const createdTime = new Date(t.createdAt).getTime();
      const now = Date.now();

      const hoursPassed = (now - createdTime) / (1000 * 60 * 60);

      let computedStatus = t.status;

      if (t.status === "ACTIVE" && hoursPassed > 12) {
        computedStatus = "INACTIVE";
      }

      return {
        ...t._doc,
        computedStatus
      };
    });

    res.json({ tickets: updatedTickets });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
});
export default router;