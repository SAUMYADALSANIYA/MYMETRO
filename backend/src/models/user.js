import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false
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
});
const User = mongoose.model("User", userSchema);
export default User;