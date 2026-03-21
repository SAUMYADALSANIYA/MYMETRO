import express from "express";
import rateLimit from "express-rate-limit";
import { getPublicMetros } from "../controllers/customerMetroController.js";

const router = express.Router();

const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});

router.get("/metros", publicLimiter, getPublicMetros);

export default router;
