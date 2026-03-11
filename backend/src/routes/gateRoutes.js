import express from "express";
import { validateExit } from "../controllers/gateController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/validate-exit", authMiddleware, validateExit);

export default router;