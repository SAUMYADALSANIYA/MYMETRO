import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import connectDB from "./config_db.js";
import User from "./models/user.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import customerMetroRoutes from "./routes/customerMetroRoutes.js";

import publicRoutes from "./routes/publicRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import gateRoutes from "./routes/gateRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import jwt from "jsonwebtoken";
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5001/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: profile.emails[0].value.split("@")[0] + Date.now(),
        email: email,
        password: "google_oauth",
        role: "Customer"
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/customer", searchRoutes);
app.use("/api/customer", customerMetroRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/gate", gateRoutes);


app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);
app.get("/", (req, res) => {
  res.send("MyMetro API Running");
});

const createDefaultAdmin = async () => {
  try{
    const adminExists = await User.findOne({ role: "Admin" });
    if(!adminExists){
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "Admin1",
        email: "admin1@mymetro.com",
        password: hashedPassword,
        role: "Admin"
      });
      console.log("Default admin created");
    }
    else{
      console.log("Admin already exists");
    }
  }
  catch(error){
    console.error("Admin creation error:", error);
  }
};

createDefaultAdmin();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});