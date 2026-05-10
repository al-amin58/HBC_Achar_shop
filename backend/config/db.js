import mongoose from "mongoose";

const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/hbc_acher";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error(
      "Start MongoDB (Windows Service or mongod) and check MONGO_URI in .env."
    );
    return false;
  }
};

export default connectDB;
