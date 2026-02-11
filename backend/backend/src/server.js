import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config_db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "*"
}));


app.use(express.json());

// AUTH ROUTES
app.use("/api/auth", authRoutes);

//const PORT = process.env.PORT || 5000;

app.listen(5001, () => {
  console.log(`Server running on port 5001`);
});