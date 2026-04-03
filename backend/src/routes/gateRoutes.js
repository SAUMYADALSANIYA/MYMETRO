import express from "express";
import { scanTicket } from "../controllers/gateController.js";
//import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/scan", scanTicket);

export default router;