import mongoose from "mongoose";

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  line: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  stationCode: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

stationSchema.index({ name: 1, line: 1 }, { unique: true });

const Station = mongoose.model("Station",stationSchema);

export default Station;