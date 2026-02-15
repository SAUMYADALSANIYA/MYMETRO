import mongoose from "mongoose";
const fareSchema = new mongoose.Schema({
  p: { type: Number, required: true },
  q: { type: Number, required: true },
  r: { type: Number, required: true },
  s: { type: Number, required: true },
  t: { type: Number, required: true }
});

const Fare = mongoose.model("Fare", fareSchema);
export default Fare;