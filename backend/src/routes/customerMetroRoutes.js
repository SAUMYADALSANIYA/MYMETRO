import express from "express";
import { getAllMetros, getAllStations } from "../controllers/customerMetroController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/metros", authMiddleware, getAllMetros);

router.get("/stations", authMiddleware, getAllStations);

export default router;