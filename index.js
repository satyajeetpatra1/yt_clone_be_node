import express from "express";
import dbConnect from "./config/dbConnect.js";
import authRouter from "./routes/Auth.route.js";

dbConnect();

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
    res.send("Hello from You Tube Clone Backend!");
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
