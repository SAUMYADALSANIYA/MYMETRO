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

  // Clear old sample (optional)
  await Route.deleteMany({ routeName: "Blue Line" });
  // schedules will be removed by routeId matching? not automatic, so clean them too:
  // (safe for sample route only)
  // We'll insert new route first, then delete schedules for that route only if needed.

  const route = await Route.create({
    routeName: "Blue Line",
    stations: ["A", "X", "Y", "B"]
  });

  await Schedule.create({
    routeId: route._id,
    startTime: "08:00",
    endTime: "22:00",
    frequencyMins: 10
  });

  console.log("Seeded: Blue Line A -> B");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});