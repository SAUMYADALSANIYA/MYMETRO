import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
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
    cvv: {
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
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;