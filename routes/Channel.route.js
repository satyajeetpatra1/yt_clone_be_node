import express from "express";
import protect from "../middlewares/Auth.middleware.js";
import { createChannel, getChannel } from "../controllers/Channel.controller.js";

const channelRouter = express.Router();
channelRouter.post("/", protect, createChannel);
channelRouter.get("/:id", getChannel);

export default channelRouter;
