import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config_db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminroute.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("MyMetro API Running");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


