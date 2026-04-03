import express from "express";
import { loginStation } from "../controllers/stationAuthController.js";

const router = express.Router();

router.post("/login", loginStation);

export default router;