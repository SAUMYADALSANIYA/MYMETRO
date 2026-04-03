import mongoose from "mongoose";
import dotenv from "dotenv";

import Route from "../models/route.js";
import Schedule from "../models/schedule.js";
import Station from "../models/station.js";
import bcrypt from "bcrypt";

dotenv.config();

async function run() {

  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB connected");

  await Route.deleteMany({});
  await Schedule.deleteMany({});
  await Station.deleteMany({});

  const routes = [
    {
      routeName: "East-West Line",
      color: "#1E88E5",
      fareRange: "₹10 - ₹35",
      estimatedDuration: "35 mins",
      stations: [
        { name: "Vastral Gam",              lat: 22.9895, lng: 72.6842 },
        { name: "Nirant Cross Road",        lat: 22.9978, lng: 72.6735 },
        { name: "Vastral",                  lat: 23.0048, lng: 72.6657 },
        { name: "Rabari Colony",            lat: 23.0133, lng: 72.6525 },
        { name: "Amraiwadi",                lat: 23.0195, lng: 72.6396 },
        { name: "Apparel Park",             lat: 23.0264, lng: 72.6258 },
        { name: "Kankaria East",            lat: 23.0187, lng: 72.6035 },
        { name: "Kalupur Railway Station",  lat: 23.0288, lng: 72.6012 },
        { name: "Gheekanta",                lat: 23.0319, lng: 72.5895 },
        { name: "Shahpur",                  lat: 23.0408, lng: 72.5804 },
        { name: "Old High Court",           lat: 23.0416, lng: 72.5668 },
        { name: "SP Stadium",               lat: 23.0438, lng: 72.5564 },
        { name: "Commerce Six Road",        lat: 23.0396, lng: 72.5478 },
        { name: "Gujarat University",       lat: 23.0362, lng: 72.5401 },
        { name: "Gurukul Road",             lat: 23.0411, lng: 72.5317 },
        { name: "Doordarshan Kendra",       lat: 23.0494, lng: 72.5219 },
        { name: "Thaltej",                  lat: 23.0527, lng: 72.5153 },
        { name: "Thaltej Gam",              lat: 23.0601, lng: 72.5074 }
      ],
      schedule: { startTime: "06:00", endTime: "22:00", frequencyMins: 8 }
    },
    {
      routeName: "North-South Line",
      color: "#E53935",
      fareRange: "₹10 - ₹40",
      estimatedDuration: "40 mins",
      stations: [
        { name: "APMC",                      lat: 22.9815, lng: 72.5852 },
        { name: "Jivraj Park",               lat: 22.9894, lng: 72.5756 },
        { name: "Rajiv Nagar",               lat: 22.9982, lng: 72.5708 },
        { name: "Shreyas",                   lat: 23.0089, lng: 72.5667 },
        { name: "Paldi",                     lat: 23.0148, lng: 72.5674 },
        { name: "Gandhigram",                lat: 23.0268, lng: 72.5712 },
        { name: "Old High Court",            lat: 23.0416, lng: 72.5668 },
        { name: "Usmanpura",                 lat: 23.0514, lng: 72.5661 },
        { name: "Vijaynagar",                lat: 23.0605, lng: 72.5719 },
        { name: "Vadaj",                     lat: 23.0681, lng: 72.5748 },
        { name: "Ranip",                     lat: 23.0837, lng: 72.5722 },
        { name: "Sabarmati Railway Station", lat: 23.0912, lng: 72.5806 },
        { name: "AEC",                       lat: 23.0991, lng: 72.5822 },
        { name: "Sabarmati",                 lat: 23.1049, lng: 72.5893 },
        { name: "Motera Stadium",            lat: 23.1074, lng: 72.6028 }
      ],
      schedule: { startTime: "06:00", endTime: "22:00", frequencyMins: 10 }
    }
  ];
  const hashedPassword = await bcrypt.hash("1234", 10);

for (const r of routes) {
  const route = await Route.create({
    routeName:         r.routeName,
    color:             r.color,
    fareRange:         r.fareRange,
    estimatedDuration: r.estimatedDuration,
    stations:          r.stations
  });

  await Schedule.create({
    routeId:       route._id,
    startTime:     r.schedule.startTime,
    endTime:       r.schedule.endTime,
    frequencyMins: r.schedule.frequencyMins
  });

  // 🔥 ADD THIS BLOCK
  for (let i = 0; i < r.stations.length; i++) {
    const station = r.stations[i];

    await Station.create({
      name: station.name,
      line: r.routeName,
      order: i,
      stationCode: (station.name.replace(/\s/g, "").substring(0,4) + i).toUpperCase(),
      password: hashedPassword
    });
  }

  console.log("Seeded:", r.routeName);
}
}

run();