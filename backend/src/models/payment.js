import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({

  source: {
    type: String,
    required: true
  },

  destination: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  cardNumber: {
    type: String,
    required: true
  },

  cardHolder: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["SUCCESS", "FAILED"],
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);