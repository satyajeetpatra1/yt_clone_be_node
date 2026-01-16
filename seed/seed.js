import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../models/User.model.js";
import Channel from "../models/Channel.model.js";
import Video from "../models/Video.model.js";
import Comment from "../models/Comment.model.js";

/* ---------- CONNECT DB ---------- */
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/youtube_clone");
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

/* ---------- SEED FUNCTION ---------- */
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Channel.deleteMany();
    await Video.deleteMany();
    await Comment.deleteMany();

    console.log("Old data cleared");

    /* ---------- USERS ---------- */

    const users = await User.insertMany([
      {
        username: "john_doe",
        email: "john@gmail.com",
        password: await bcrypt.hash("123456", 10),
      },
      {
        username: "emma_watson",
        email: "emma@gmail.com",
        password: await bcrypt.hash("123456", 10),
      },
    ]);

    /* ---------- CHANNELS ---------- */
    const channels = await Channel.insertMany([
      {
        channelName: "Tech Explained",
        description: "Tech tutorials and coding videos",
        owner: users[0]._id,
      },
      {
        channelName: "Movie World",
        description: "Movie reviews and trailers",
        owner: users[1]._id,
      },
    ]);

    /* ---------- VIDEOS ---------- */
    const videos = await Video.insertMany([
      {
        title: "React in 10 Minutes",
        description: "Learn React quickly",
        videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8",
        channel: channels[0]._id,
        views: 1200,
      },
      {
        title: "Best Movies of 2024",
        description: "Top movie recommendations",
        videoUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
        channel: channels[1]._id,
        views: 5400,
      },
    ]);

    /* ---------- COMMENTS ---------- */
    await Comment.insertMany([
      {
        text: "Amazing explanation 🔥",
        user: users[1]._id,
        video: videos[0]._id,
      },
      {
        text: "Loved this video!",
        user: users[0]._id,
        video: videos[1]._id,
      },
    ]);

    console.log("Database seeded successfully 🌱");
    process.exit();
  } catch (error) {
    console.error("Seeding failed ❌", error);
    process.exit(1);
  }
};

seedDatabase();
