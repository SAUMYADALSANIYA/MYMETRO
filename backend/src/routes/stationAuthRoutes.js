import express from "express";
import { loginStation } from "../controllers/stationAuthController.js";
import Station from "../models/station.js"; // ✅ ADD THIS

const router = express.Router();

// ✅ ENABLE LOGIN
router.post("/login", loginStation);

// ✅ DEBUG ROUTE
router.get("/all", async (req, res) => {
  const stations = await Station.find();
  res.json(stations);
});

export default router;