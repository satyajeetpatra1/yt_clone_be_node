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

const iframeVideos = [
  "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "https://www.youtube.com/embed/9bZkp7q19f0",
  "https://www.youtube.com/embed/3tmd-ClpJxA",
  "https://www.youtube.com/embed/l482T0yNkeo",
  "https://www.youtube.com/embed/e-ORhEE9VVg",
  "https://www.youtube.com/embed/kJQP7kiw5Fk",
];

const categories = ["Tech", "Music", "Education", "Gaming", "Vlogs", "Comedy", "Movies"];

/* ------------------ HELPERS ------------------ */

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// generate 1–3 unique categories
const generateCategories = () =>
  Array.from(
    new Set(
      Array(randomInt(1, 3))
        .fill(null)
        .map(() => random(categories))
    )
  );

// Picsum = hotlink safe ✅
const generateThumbnail = (seed) =>
  `https://picsum.photos/seed/video-${seed}/320/180`;

const generateBanner = (seed) =>
  `https://picsum.photos/seed/banner-${seed}/1200/300`;

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
    for (let i = 0; i < 6; i++) {
      const user = await User.create({
        username: `user${i + 1}`,
        email: `user${i + 1}@gmail.com`,
        password: await bcrypt.hash("password123", 10),
        avatar: avatars[i],
      });
      users.push(user);
    }

    console.log("👤 Users created");

    /* -------- CHANNELS -------- */
    const channels = [];
    for (let i = 0; i < users.length; i++) {
      const channel = await Channel.create({
        channelName: `${users[i].username} Channel`,
        description: `Welcome to ${users[i].username}'s YouTube channel`,
        avatar: users[i].avatar,
        banner: generateBanner(i + 1),
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
    let seed = 1;

    for (const channel of channels) {
      const videoCount = randomInt(4, 6);

      for (let i = 0; i < videoCount; i++) {
        const videoCategories = generateCategories();

        const video = await Video.create({
          title: `Awesome Video ${i + 1}`,
          description: "This is a demo YouTube video description",
          videoUrl: random(iframeVideos),

          thumbnailUrl: generateThumbnail(seed++),

          category: videoCategories,
          channel: channel._id,
          views: randomInt(500, 50000),
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
