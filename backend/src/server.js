import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config_db.js";
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
