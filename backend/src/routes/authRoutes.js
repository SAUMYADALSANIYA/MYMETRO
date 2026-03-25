import express from "express";
import { register, login, changePassword } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import passport from "passport";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account" 
  })
);


router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/"
  }),
  (req, res) => {
    
    res.redirect("http://localhost:5173/oauth-success");
  }
);



router.post("/register", register);
router.post("/login", login);
router.put("/change-password", authMiddleware, changePassword);

export default router;