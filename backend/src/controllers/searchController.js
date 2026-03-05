import Route from "../models/route.js";
import Schedule from "../models/schedule.js";
import Fare from "../models/fare.js";

function computeFareByStops(stops, fareDoc) {
  // You can change these slabs later if your team decides a different rule
  if (stops <= 3) return fareDoc.p;
  if (stops <= 6) return fareDoc.q;
  if (stops <= 9) return fareDoc.r;
  if (stops <= 12) return fareDoc.s;
  return fareDoc.t;
}

export const searchRoutes = async (req, res) => {
  try {
    // Only customers use this
    if (req.user.role !== "Customer") {
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

    // Find routes that contain both stations (unordered)
    const candidateRoutes = await Route.find({
      stations: { $all: [source, destination] }
    });

    const results = [];

    for (const r of candidateRoutes) {
      const sIdx = r.stations.indexOf(source);
      const dIdx = r.stations.indexOf(destination);

      // destination must be AFTER source
      if (sIdx === -1 || dIdx === -1) continue;
      if (dIdx <= sIdx) continue;

      const stops = dIdx - sIdx; // number of station-hops between
      const computedFare = computeFareByStops(stops, fare);

      const schedule = await Schedule.findOne({ routeId: r._id });

      results.push({
        routeId: r._id,
        routeName: r.routeName,
        source,
        destination,
        stops,
        fare: computedFare,
        schedule: schedule
          ? {
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              frequencyMins: schedule.frequencyMins
            }
          : null
      });
    }

    return res.status(200).json({
      count: results.length,
      results
    });
  } catch (err) {
    console.error("searchRoutes error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};