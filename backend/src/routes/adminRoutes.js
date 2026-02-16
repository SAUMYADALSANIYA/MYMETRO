import express from "express";
const router = express.Router();
import { 
  changePassword,
  updateFare,
  getFare,
  createAdmin
} from "../controllers/adminController.js";

import authMiddleware  from "../middleware/authMiddleware.js";

router.put("/change-password", authMiddleware, changePassword);

router.put("/update-fare", authMiddleware, updateFare);

router.get("/get-fare", authMiddleware, getFare);

router.post("/create-admin", authMiddleware, createAdmin);


export default router;
