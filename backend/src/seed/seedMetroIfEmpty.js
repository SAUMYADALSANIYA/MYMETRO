import Route from "../models/route.js";
import Schedule from "../models/schedule.js";

export const seedMetroIfEmpty = async () => {
  try {
    const metroData = [
      {
        routeName: "Blue Line",
        stations: ["A", "X", "Y", "B", "C"],
        schedule: {
          startTime: "06:00",
          endTime: "22:00",
          frequencyMins: 10
        }
      },
      {
        routeName: "Yellow Line",
        stations: ["D", "E", "X", "F", "G"],
        schedule: {
          startTime: "05:30",
          endTime: "23:00",
          frequencyMins: 8
        }
      },
      {
        routeName: "Red Line",
        stations: ["H", "I", "J", "B", "K"],
        schedule: {
          startTime: "06:15",
          endTime: "21:45",
          frequencyMins: 12
        }
      }
    ];

    for (const r of metroData) {
      const existingRoute = await Route.findOne({ routeName: r.routeName });

      if (existingRoute) {
        console.log(`${r.routeName} already exists`);
        continue;
      }

      const newRoute = await Route.create({
        routeName: r.routeName,
        stations: r.stations
      });

      await Schedule.create({
        routeId: newRoute._id,
        startTime: r.schedule.startTime,
        endTime: r.schedule.endTime,
        frequencyMins: r.schedule.frequencyMins
      });

      console.log(`Seeded: ${r.routeName}`);
    }

    console.log("Metro seed check completed");
  } catch (error) {
    console.error("Metro seeding error:", error);
  }
};