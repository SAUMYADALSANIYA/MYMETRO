import Route from "../models/route.js";
import Schedule from "../models/schedule.js";

export const getAllMetros = async (req, res) => {
  try {

    if (req.user.role !== "Customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const routes = await Route.find().sort({ routeName: 1 });

    const routeIds = routes.map(r => r._id);

    const schedules = await Schedule.find({
      routeId: { $in: routeIds }
    });

    const scheduleMap = new Map();

    schedules.forEach(s => {
      scheduleMap.set(String(s.routeId), s);
    });

    const metros = routes.map(r => {
      const s = scheduleMap.get(String(r._id));

      return {
        routeId: r._id,
        routeName: r.routeName,
        stations: r.stations,
        schedule: s
          ? {
              startTime: s.startTime,
              endTime: s.endTime,
              frequencyMins: s.frequencyMins
            }
          : null
      };
    });

    res.json({
      count: metros.length,
      metros
    });

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
      r.stations.forEach(s => set.add(s));
    });

    const stations = Array.from(set).sort();

    res.json({
      count: stations.length,
      stations
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};