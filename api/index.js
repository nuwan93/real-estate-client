import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import path from "path";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const _dirname = path.resolve();

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server is listening on port 3000!!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use(express.static(path.join(_dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "client", "dist", "index.html"));
});

//Middleware for error handling
app.use((err, req, res, next) => {
  const message = err.message || "internel server error";
  const statusCode = err.statusCode || 501;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
