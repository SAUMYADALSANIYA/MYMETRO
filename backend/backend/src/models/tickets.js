import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    journeyDate: {
      type: Date,
      required: true,
      default: Date.now
    },

    source: {
      type: String,
      required: true
    },

    destination: {
      type: String,
      required: true
    },

    boughtBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
