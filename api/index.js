import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "../routes/user.routes.js";

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

app.listen(PORT, () => {
  console.log(`Server is runninig on port ${PORT}`);
});

app.use("/api/user", userRoutes);
