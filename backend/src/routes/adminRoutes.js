import express from "express";
const router = express.Router();
import { 
  changePassword,
  updateFare,
  getFare
} from "../controllers/adminController.js";

import authMiddleware  from "../middleware/authMiddleware.js";

router.put("/change-password", authMiddleware, changePassword);

router.put("/update-fare", authMiddleware, updateFare);

router.get("/get-fare", authMiddleware, getFare);

export default router;
