import express from "express";
import { scanTicket } from "../controllers/gateController.js";
import { stationAuthMiddleware } from "../middleware/stationAuthMiddleware.js";

const router = express.Router();

router.post("/scan", stationAuthMiddleware, scanTicket);

export default router;