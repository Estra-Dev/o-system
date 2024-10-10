import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import systemRouter from "./routes/system.routes.js";
import mattersRouter from "./routes/matters.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

// connect mongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => console.log(err));

// App configs
const app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is runninig on port ${PORT}`);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/system", systemRouter);
app.use("/api/matter", mattersRouter);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
