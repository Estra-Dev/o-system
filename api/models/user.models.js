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
    profilePicture: {
      type: String,
      default:
        "https://th.bing.com/th/id/OIP.iFW8SCze8S0rADU4kyUUrgAAAA?w=360&h=360&rs=1&pid=ImgDetMain",
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
