import express from "express";
import { searchRoute } from "../controllers/searchController.js";

const router = express.Router();

// GET /api/customer/search?source=A&destination=E
router.get("/search", searchRoute);

export default router;