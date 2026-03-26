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
import roleMiddleware from "../middleware/roleMiddleware.js";

router.put("/change-password", authMiddleware, roleMiddleware("Admin"), changePassword);

router.put("/update-fare", authMiddleware, roleMiddleware("Admin"), updateFare);

router.get("/get-fare", authMiddleware, roleMiddleware("Admin"), getFare);

router.post("/create-admin", authMiddleware, roleMiddleware("Admin"), createAdmin);

router.get("/get-users", authMiddleware,roleMiddleware("Admin"), getUsers);

router.get("/get-admins", authMiddleware,roleMiddleware("Admin"), getAdmins);

router.get("/user/:id/journeys", authMiddleware,roleMiddleware("Admin"), getUserJourneys);

router.get("/dashboard-stats", authMiddleware,roleMiddleware("Admin"), getDashboardStats);


export default router;
