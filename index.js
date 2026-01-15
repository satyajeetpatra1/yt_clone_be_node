import express from "express";
import dbConnect from "./config/dbConnect.js";

dbConnect();

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from yt_clone_be_node");
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
