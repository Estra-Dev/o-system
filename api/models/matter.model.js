import { Schema, model } from "mongoose";

const matterSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    systemId: {
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
  },
  { timestamps: true }
);

const Matter = model("Matter", matterSchema);

export default Matter;
