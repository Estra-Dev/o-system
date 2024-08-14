import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => console.log(err));
const app = express();
const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is runninig on port ${PORT}`);
});
