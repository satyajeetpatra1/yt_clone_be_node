import express from "express";
import protect from "../middlewares/Auth.middleware.js";
import {
  createChannel,
  getChannelById,
  getMyChannel,
} from "../controllers/Channel.controller.js";

const channelRouter = express.Router();
channelRouter.post("/", protect, createChannel);
channelRouter.get("/me", protect, getMyChannel);
channelRouter.get("/:id", getChannelById);

export default channelRouter;
