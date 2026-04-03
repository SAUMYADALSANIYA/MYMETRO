import Station from "../models/station.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginStation = async (req, res) => {
  try {
    const { stationCode, password } = req.body;

    const station = await Station.findOne({ stationCode });

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const match = await bcrypt.compare(password, station.password);

    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { stationId: station._id, name: station.name },
      process.env.JWT_SECRET
    );

    res.json({ token, station });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};