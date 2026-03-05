import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    routeName: { type: String, required: true, unique: true },
  
    stations: [{ type: String, required: true }]
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", routeSchema);
export default Route;