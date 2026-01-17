import mongoose from "mongoose";

// Channel Schema
const channelSchema = new mongoose.Schema(
  {
    channelName: { type: String, required: true, unique: true },
    description: String,
    avatar: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    banner: String,
    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Channel", channelSchema);
