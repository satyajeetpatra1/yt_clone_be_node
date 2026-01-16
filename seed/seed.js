import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../models/User.model.js";
import Channel from "../models/Channel.model.js";
import Video from "../models/Video.model.js";
import Comment from "../models/Comment.model.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/youtube_clone";

/* ------------------ DUMMY ASSETS ------------------ */

const avatars = [
  "https://i.pravatar.cc/150?img=11",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=13",
  "https://i.pravatar.cc/150?img=14",
  "https://i.pravatar.cc/150?img=15",
  "https://i.pravatar.cc/150?img=16",
];

const banners = [
  "https://placehold.co/1200x300/ff0000/ffffff?text=Tech+Channel",
  "https://placehold.co/1200x300/0000ff/ffffff?text=Music+Channel",
  "https://placehold.co/1200x300/00aa00/ffffff?text=Coding+Channel",
  "https://placehold.co/1200x300/ffaa00/ffffff?text=Vlogs",
  "https://placehold.co/1200x300/5500aa/ffffff?text=Education",
  "https://placehold.co/1200x300/222222/ffffff?text=Gaming",
];

const thumbnails = [
  "https://placehold.co/320x180/ff0000/ffffff?text=Video+1",
  "https://placehold.co/320x180/0000ff/ffffff?text=Video+2",
  "https://placehold.co/320x180/00aa00/ffffff?text=Video+3",
  "https://placehold.co/320x180/ffaa00/ffffff?text=Video+4",
  "https://placehold.co/320x180/5500aa/ffffff?text=Video+5",
  "https://placehold.co/320x180/222222/ffffff?text=Video+6",
];

const iframeVideos = [
  "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "https://www.youtube.com/embed/9bZkp7q19f0",
  "https://www.youtube.com/embed/3tmd-ClpJxA",
  "https://www.youtube.com/embed/l482T0yNkeo",
  "https://www.youtube.com/embed/e-ORhEE9VVg",
  "https://www.youtube.com/embed/kJQP7kiw5Fk",
];

const categories = ["Tech", "Music", "Education", "Gaming", "Vlogs"];

/* ------------------ HELPERS ------------------ */

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/* ------------------ SEED SCRIPT ------------------ */

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    await Promise.all([
      User.deleteMany(),
      Channel.deleteMany(),
      Video.deleteMany(),
      Comment.deleteMany(),
    ]);

    console.log("🧹 Database cleared");

    /* -------- USERS -------- */
    const users = [];
    for (let i = 1; i <= 6; i++) {
      const user = await User.create({
        username: `user${i}`,
        email: `user${i}@gmail.com`,
        password: await bcrypt.hash("password123", 10),
        avatar: avatars[i - 1],
      });
      users.push(user);
    }

    console.log("👤 Users created");

    /* -------- CHANNELS -------- */
    const channels = [];
    for (let i = 0; i < users.length; i++) {
      const channel = await Channel.create({
        channelName: `${users[i].username} Channel`,
        description: `Welcome to ${users[i].username}'s channel`,
        avatar: users[i].avatar,
        banner: banners[i],
        owner: users[i]._id,
        subscribers: users
          .filter((u) => u._id.toString() !== users[i]._id.toString())
          .map((u) => u._id),
      });
      channels.push(channel);
    }

    console.log("📺 Channels created");

    /* -------- VIDEOS -------- */
    const videos = [];
    for (const channel of channels) {
      const videoCount = randomInt(4, 6);

      for (let i = 0; i < videoCount; i++) {
        const video = await Video.create({
          title: `Awesome Video ${i + 1}`,
          description: "This is a demo YouTube video description",
          videoUrl: random(iframeVideos),
          thumbnailUrl: random(thumbnails),
          category: random(categories),
          channel: channel._id,
          views: randomInt(100, 10000),
          likes: users.slice(0, randomInt(2, 5)).map((u) => u._id),
          dislikes: users.slice(0, randomInt(0, 2)).map((u) => u._id),
        });

        videos.push(video);
      }
    }

    console.log("🎬 Videos created");

    /* -------- COMMENTS -------- */
    for (const video of videos) {
      const commentCount = randomInt(5, 7);

      for (let i = 1; i <= commentCount; i++) {
        await Comment.create({
          text: `This is comment ${i} on "${video.title}"`,
          user: random(users)._id,
          video: video._id,
        });
      }
    }

    console.log("💬 Comments created");

    console.log("🎉 DATABASE SEEDED SUCCESSFULLY");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedDB();
