import express from "express";
import protect from "../middlewares/Auth.middleware.js";
import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/Comment.controller.js";

const commentRouter = express.Router();

commentRouter.post("/:videoId", protect, addComment);
commentRouter.get("/:videoId", getComments);
commentRouter.delete("/:id", protect, deleteComment);

export default commentRouter;
