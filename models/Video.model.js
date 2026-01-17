import mongoose from "mongoose";

// Video Schema
const videoSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    videoUrl: String, // iframe URL
    thumbnailUrl: String,
    category: {
      type: [String],
      default: [],
    },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
