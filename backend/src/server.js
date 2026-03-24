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

import { seedMetroIfEmpty } from "./seed/seedMetroIfEmpty.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/customer", searchRoutes);
app.use("/api/customer", customerMetroRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/gate", gateRoutes);

app.get("/", (req, res) => {
  res.send("MyMetro API Running");
});

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "Admin" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await User.create({
        username: "Admin1",
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
