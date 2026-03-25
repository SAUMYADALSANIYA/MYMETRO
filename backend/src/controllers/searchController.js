import Fare from "../models/fare.js";
import { findShortestPath } from "../utils/pathFinder.js";

function computeFareByStops(stops, fareDoc) {
  // You can change these slabs later if your team decides a different rule
  if (stops <= 3) return fareDoc.p;
  if (stops <= 6) return fareDoc.q;
  if (stops <= 9) return fareDoc.r;
  if (stops <= 12) return fareDoc.s;
  return fareDoc.t;
}

export const searchRoute = async (req, res) => {
  try {
    // FIX: Added a check to make sure req.user exists before reading role
    if (req.user && req.user.role !== "Customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const source = (req.query.source || "").trim();
    const destination = (req.query.destination || "").trim();

    if (!source || !destination) {
      return res.status(400).json({ message: "source and destination are required" });
    }

    if (source === destination) {
      return res.status(400).json({ message: "source and destination cannot be same" });
    }

    // Fare doc (create default if missing)
    let fare = await Fare.findOne();
    if (!fare) {
      fare = await Fare.create({ p: 10, q: 20, r: 30, s: 40, t: 50 });
    }

    const routeData = await findShortestPath(source, destination);

    if (!routeData) {
      return res.status(404).json({ message: "No path found between these stations." });
    }

    const computedFare = computeFareByStops(routeData.stops, fare);
    const estimatedTimeMins = routeData.stops * 3; // Roughly 3 mins per stop

    const result = {
      source,
      destination,
      stops: routeData.stops,
      fare: computedFare,
      estimatedTimeMins,
      path: routeData.path,
      interchangesRequired: routeData.interchangesRequired,
      linesUsed: routeData.linesUsed,
      detailedPath: routeData.routeDetails
    };

    return res.status(200).json({
      message: "Route found",
      data: result
    });
  } catch (err) {
    console.error("searchRoute error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};