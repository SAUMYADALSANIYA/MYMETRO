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
import paymentRoutes from "./routes/paymentRoutes.js";
import gateRoutes from "./routes/gateRoutes.js";
import publicRoutes from "./routes/publicRoutes.js"
import session from "express-session";
import ticketRoutes from "./routes/ticketRouts.js";


import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import jwt from "jsonwebtoken";

import { seedMetroIfEmpty } from "./seed/seedMetroIfEmpty.js";
import stationAuthRoutes from "./routes/stationAuthRoutes.js";



dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://poetic-cendol-d3a4ba.netlify.app"
  ],
  credentials: true
}));

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
  callbackURL: "https://mymetro.onrender.com/auth/google/callback",
  passReqToCallback: true
},
async (req, accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    // 🔥 check by googleId
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // 🔥 check by email
      user = await User.findOne({ email });

      if (user) {
        // link Google account
        user.googleId = profile.id;
        await user.save();
      } else {
        // create new user
        user = await User.create({
          email,
          googleId: profile.id,
          role: "Customer"
        });
      }
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
app.use("/api/tickets", ticketRoutes);
app.use("/api/station", stationAuthRoutes);

app.get("/auth/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    prompt: "select_account consent"
  })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.redirect(`https://poetic-cendol-d3a4ba.netlify.app/oauth-success?token=${token}`);
  }
);
app.get("/", (req, res) => {
  res.send("MyMetro API Running");
});

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "Admin" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await User.create({
        email: "admin1@mymetro.com",
        password: hashedPassword,
        role: "Admin"
      });

      console.log("Default admin created");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("Admin creation error:", error);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");

    await createDefaultAdmin();
    await seedMetroIfEmpty();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
