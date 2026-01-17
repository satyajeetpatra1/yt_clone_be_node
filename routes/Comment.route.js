import express from "express";
import protect from "../middlewares/Auth.middleware.js";
import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/Comment.controller.js";

// Comment routes
const commentRouter = express.Router();

// Add a new comment
commentRouter.post("/:videoId", protect, addComment);
// Get comments for a video
commentRouter.get("/:videoId", getComments);
// Delete a comment by ID
commentRouter.delete("/:id", protect, deleteComment);

export default commentRouter;
