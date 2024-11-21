import { Schema, model } from "mongoose";

const matterSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userProfileImage: {
      type: String,
    },
    systemId: {
      type: String,
      required: true,
    },
    anon_name: {
      type: String,
      required: true,
    },
    system_name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Matter = model("Matter", matterSchema);

export default Matter;
