import { Schema, model } from "mongoose";

const userSchema = Schema(
  {
    firstname: {
      type: String,
      required: true,
      min: 2,
    },
    lastname: {
      type: String,
      required: true,
      min: 2,
    },
    anon_name: {
      type: String,
      required: true,
      unique: true,
      min: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
