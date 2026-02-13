import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config_db.js";
import authRoutes from "./src/routes/authRoutes.js"; 

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes); 

app.get("/", (req, res) => {
  res.send("MyMetro API Running");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
