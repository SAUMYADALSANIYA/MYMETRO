import express from "express";
const router = express.Router();
import { 
  changePassword,
  updateFare,
  getFare,
  createAdmin,
  getUsers,
  getAdmins,
  getUserJourneys,
  getDashboardStats
} from "../controllers/adminController.js";

import authMiddleware  from "../middleware/authMiddleware.js";

router.put("/change-password", authMiddleware, changePassword);

router.put("/update-fare", authMiddleware, updateFare);

router.get("/get-fare", authMiddleware, getFare);

router.post("/create-admin", authMiddleware, createAdmin);

router.get("/get-users", authMiddleware, getUsers);

router.get("/get-admins", authMiddleware, getAdmins);

router.get("/user/:id/journeys", authMiddleware, getUserJourneys);

router.get("/dashboard-stats", authMiddleware, getDashboardStats);


export default router;
