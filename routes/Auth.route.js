import express from "express";
import { registerUser, loginUser } from "../controllers/Auth.controller.js";

// Auth routes
const authRouter = express.Router();

// Register route
authRouter.post("/register", registerUser);
// Login route
authRouter.post("/login", loginUser);

export default authRouter;
