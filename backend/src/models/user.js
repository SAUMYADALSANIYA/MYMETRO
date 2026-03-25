import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: false // ✅ important for Google users
    },
    googleId: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: ["Admin", "Customer"],
      default: "Customer"
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);


userSchema.methods.comparePassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};


delete mongoose.models.User;

const User = mongoose.model("User", userSchema);
export default User;