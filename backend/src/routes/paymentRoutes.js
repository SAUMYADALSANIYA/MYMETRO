import express from "express";
import { processPayment } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/pay", authMiddleware, processPayment);

export default router;