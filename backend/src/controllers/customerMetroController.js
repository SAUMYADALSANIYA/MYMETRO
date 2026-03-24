import Route from "../models/route.js";
import Schedule from "../models/schedule.js";

/**
 * Fetches schedules for the given routes and merges them into a unified
 * metro response array that includes routeId, routeName, color, fareRange,
 * estimatedDuration, stations, and an optional schedule object.
 *
 * @param {import("../models/route.js").default[]} routes - Array of Route documents
 * @returns {Promise<object[]>} Array of merged metro objects
 */
async function buildMetrosResponse(routes) {
  const routeIds = routes.map(r => r._id);

  const schedules = await Schedule.find({ routeId: { $in: routeIds } });

  const scheduleMap = new Map();
  schedules.forEach(s => {
    scheduleMap.set(String(s.routeId), s);
  });

  return routes.map(r => {
    const s = scheduleMap.get(String(r._id));

    return {
      routeId:           r._id,
      routeName:         r.routeName,
      color:             r.color,
      fareRange:         r.fareRange,
      estimatedDuration: r.estimatedDuration,
      stations:          r.stations,
      schedule: s
        ? {
            startTime:    s.startTime,
            endTime:      s.endTime,
            frequencyMins: s.frequencyMins
          }
        : null
    };
  });
}

export const getPublicMetros = async (req, res) => {
  try {
    const routes = await Route.find().sort({ routeName: 1 });
    const metros = await buildMetrosResponse(routes);
    res.json({ count: metros.length, metros });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllMetros = async (req, res) => {
  try {
    if (req.user.role !== "Customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const routes = await Route.find().sort({ routeName: 1 });
    const metros = await buildMetrosResponse(routes);

    res.json({ count: metros.length, metros });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllStations = async (req, res) => {
  try {
    if (req.user.role !== "Customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const routes = await Route.find({}, { stations: 1 });

    const set = new Set();
    routes.forEach(r => {
      r.stations.forEach(s => set.add(s.name));
    });

    const stations = Array.from(set).sort();

    res.json({ count: stations.length, stations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};