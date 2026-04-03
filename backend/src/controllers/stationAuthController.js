import bcrypt from "bcrypt";
import Station from "../models/station.js";
import jwt from "jsonwebtoken";

export const loginStation = async (req, res) => {
  try {
    const { qrToken } = req.body;
    const station = req.station.stationCode;

    

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

   
    const isMatch = await bcrypt.compare(password, station.password);
    console.log("Entered password:", password);
console.log("Hash from DB:", station.password);
console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    
    const token = jwt.sign(
      { stationId: station._id, stationCode: station.stationCode },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
  success: true,
  token,
  station: {
    name: station.name
  }
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};