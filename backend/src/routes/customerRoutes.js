import express from "express";
import Ticket from "../models/ticket.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-journeys", authMiddleware, async (req, res) => {
  try{
    if(req.user.role !== "Customer"){
      return res.status(403).json({ message: "Access denied" });
    }
    const journeys = await Ticket.find({
      boughtBy: req.user.id
    }).sort({ createdAt: -1 });
    res.json(journeys);
  }
  catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
