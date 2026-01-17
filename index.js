import express from "express";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRouter from "./routes/Auth.route.js";
import channelRouter from "./routes/Channel.route.js";
import videoRouter from "./routes/Video.route.js";
import commentRouter from "./routes/Comment.route.js";

// Connect to database
dbConnect();

// Initialize Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/channels", channelRouter);
app.use("/api/videos", videoRouter);
app.use("/api/comments", commentRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Hello from You Tube Clone Backend!");
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
