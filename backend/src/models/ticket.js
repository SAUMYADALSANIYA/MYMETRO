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

    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true
    },

    routeName: {
      type: String,
      required: true
    },

    farePaid: {
      type: Number,
      required: true
    },

    boughtBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    qrToken: {
      type: String,
      required: true,
      unique: true
    },

    scanUrl: {
      type: String,
      required: true
    },

    qrCodeDataUrl: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "USED"],
      default: "ACTIVE"
    },

    usedAt: {
      type: Date,
      default: null
    },

    parentTicketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      default: null
    }
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;