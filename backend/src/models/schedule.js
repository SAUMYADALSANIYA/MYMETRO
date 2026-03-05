import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },

    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

   
    frequencyMins: { type: Number, required: true }
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;