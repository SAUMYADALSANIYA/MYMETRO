import mongoose from "mongoose";
import dotenv from "dotenv";
import Route from "../models/route.js";
import Schedule from "../models/schedule.js";

dotenv.config();

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Set it before running seed.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected for seeding");

  // Clear old data
  await Route.deleteMany({});
  await Schedule.deleteMany({});

  // 1. Blue Line (A -> X -> Y -> B)
  const blueLine = await Route.create({
    routeName: "Blue Line",
    color: "#1E88E5",
    stations: [
      { name: "A", lat: 28.6139, lng: 77.2090 },
      { name: "X", lat: 28.6200, lng: 77.2100 }, // Intersection station
      { name: "Y", lat: 28.6300, lng: 77.2200 },
      { name: "B", lat: 28.6400, lng: 77.2300 }
    ]
  });

  // 2. Red Line (C -> X -> D -> E)
  const redLine = await Route.create({
    routeName: "Red Line",
    color: "#E53935",
    stations: [
      { name: "C", lat: 28.6100, lng: 77.2000 },
      { name: "X", lat: 28.6200, lng: 77.2100 }, // Intersection station
      { name: "D", lat: 28.6250, lng: 77.2150 },
      { name: "E", lat: 28.6350, lng: 77.2250 }
    ]
  });

  // Create Schedules
  await Schedule.create([
    { routeId: blueLine._id, startTime: "06:00", endTime: "23:00", frequencyMins: 10 },
    { routeId: redLine._id, startTime: "06:00", endTime: "23:00", frequencyMins: 8 }
  ]);

  console.log("Seeded Graph Network:");
  console.log("Blue Line: A <-> X <-> Y <-> B");
  console.log("Red Line : C <-> X <-> D <-> E");
  console.log("Intersection at: X");

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});