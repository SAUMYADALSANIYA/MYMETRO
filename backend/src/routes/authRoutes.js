import express from "express";
import { register, login, changePassword, forgotPassword, resetPassword } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import passport from "passport";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
  res.redirect("https://poetic-cendol-d3a4ba.netlify.app/oauth-success");
});

router.post("/register", register);
router.post("/login", login);
router.put("/change-password", authMiddleware, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;