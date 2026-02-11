import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    console.log("Connected to DB:", mongoose.connection.name);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
