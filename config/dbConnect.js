import mongoose from "mongoose";

// connection to MongoDB Logic
const dbConnect = async () => {
  try {
    // local mongodb url
    await mongoose.connect("mongodb://127.0.0.1:27017/youtube_clone");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default dbConnect;
