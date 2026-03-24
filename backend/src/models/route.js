import mongoose from "mongoose";

const stationCoordSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lat:  { type: Number, required: true },
    lng:  { type: Number, required: true }
  },
  { _id: false }
);

const routeSchema = new mongoose.Schema(
  {
    routeName:         { type: String, required: true, unique: true },
    color:             { type: String, default: "#1E88E5" },
    fareRange:         { type: String, default: "" },
    estimatedDuration: { type: String, default: "" },
    stations:          { type: [stationCoordSchema], required: true }
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", routeSchema);
export default Route;