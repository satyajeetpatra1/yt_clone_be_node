import express from "express";
import protect from "../middlewares/Auth.middleware.js";
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo
} from "../controllers/Video.controller.js";

const videoRouter = express.Router();

videoRouter.get("/", getVideos);
videoRouter.get("/:id", getVideoById);
videoRouter.post("/", protect, createVideo);
videoRouter.put("/:id", protect, updateVideo);
videoRouter.delete("/:id", protect, deleteVideo);

export default videoRouter;