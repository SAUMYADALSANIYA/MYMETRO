import mongoose from "mongoose";
import dotenv from "dotenv";

import Route from "../models/route.js";
import Schedule from "../models/schedule.js";

dotenv.config();

async function run() {

  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB connected");

  await Route.deleteMany({});
  await Schedule.deleteMany({});

  const routes = [

    {
      routeName:"Blue Line",
      stations:["A","X","Y","B","C"],
      schedule:{
        startTime:"06:00",
        endTime:"22:00",
        frequencyMins:10
      }
    },

    {
      routeName:"Yellow Line",
      stations:["D","E","X","F","G"],
      schedule:{
        startTime:"05:30",
        endTime:"23:00",
        frequencyMins:8
      }
    },

    {
      routeName:"Red Line",
      stations:["H","I","J","B","K"],
      schedule:{
        startTime:"06:15",
        endTime:"21:45",
        frequencyMins:12
      }
    }

  ];


  for(const r of routes){

    const route = await Route.create({
      routeName:r.routeName,
      stations:r.stations
    });

    await Schedule.create({
      routeId:route._id,
      startTime:r.schedule.startTime,
      endTime:r.schedule.endTime,
      frequencyMins:r.schedule.frequencyMins
    });

    console.log("Seeded:",r.routeName);

  }

  await mongoose.disconnect();

  console.log("Seeding completed");

}

run();