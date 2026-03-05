import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { searchRoutes } from "../controllers/searchController.js";

const router = express.Router();

// GET /api/customer/search?source=A&destination=B
router.get("/search", authMiddleware, searchRoutes);

export default router;