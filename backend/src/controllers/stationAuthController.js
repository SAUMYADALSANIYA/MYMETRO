import bcrypt from "bcrypt";
import Station from "../models/station.js";
import jwt from "jsonwebtoken";

export const loginStation = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body); // 🔥 DEBUG

    if (!req.body) {
      return res.status(400).json({ message: "No body received" });
    }

    const { stationCode, password } = req.body;

    if (!stationCode || !password) {
      return res.status(400).json({ message: "Missing stationCode or password" });
    }

    const station = await Station.findOne({ stationCode });

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const isMatch = await bcrypt.compare(password, station.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ SAFE JWT
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET missing ❌");
      return res.status(500).json({ message: "JWT config error" });
    }

    const token = jwt.sign(
      { stationId: station._id, stationCode: station.stationCode },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      station: { name: station.name }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err); 
    res.status(500).json({ message: "Server error" });
  }
};