import express from "express";
import protect from "../middlewares/Auth.middleware.js";
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  searchVideos,
} from "../controllers/Video.controller.js";

// Video routes
const videoRouter = express.Router();

// Get all videos
videoRouter.get("/", getVideos);
// Search videos
videoRouter.get("/search", searchVideos);
// Get video by ID
videoRouter.get("/:id", getVideoById);

// Create, update, delete, like, dislike video (protected routes)
videoRouter.post("/", protect, createVideo);
videoRouter.put("/:id/like", protect, likeVideo);
videoRouter.put("/:id/dislike", protect, dislikeVideo);
videoRouter.put("/:id", protect, updateVideo);
videoRouter.delete("/:id", protect, deleteVideo);

export default videoRouter;
