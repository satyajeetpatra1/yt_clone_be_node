import mongoose from "mongoose";

// connection to MongoDB Logic
const dbConnect = async () => {
  try {
    // local mongodb url
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default dbConnect;
