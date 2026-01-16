import express from "express";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRouter from "./routes/Auth.route.js";
import channelRouter from "./routes/Channel.route.js";
import videoRouter from "./routes/Video.route.js";
import commentRouter from "./routes/Comment.route.js";

dbConnect();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/channels", channelRouter);
app.use("/api/videos", videoRouter);
app.use("/api/comments", commentRouter);

app.get("/", (req, res) => {
  res.send("Hello from You Tube Clone Backend!");
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
