import express from "express";
import protect from "../middlewares/Auth.middleware.js";
import {
  createChannel,
  getChannelById,
  getMyChannel,
  updateChannel,
} from "../controllers/Channel.controller.js";

// Channel routes
const channelRouter = express.Router();

// Create channel
channelRouter.post("/", protect, createChannel);
// Get my channel
channelRouter.get("/me", protect, getMyChannel);
// Get channel by ID
channelRouter.get("/:id", getChannelById);
// Update channel by ID
channelRouter.put("/:id", protect, updateChannel);

export default channelRouter;
