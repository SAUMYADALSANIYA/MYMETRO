import express from "express";
import {
  processPayment,
  processExtraFarePayment
} from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/pay", authMiddleware, processPayment);
router.post("/pay-extra", authMiddleware, processExtraFarePayment);

export default router;