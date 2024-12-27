import { Schema, model } from "mongoose";

const updatesSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Updates = model("Update", updatesSchema);
export default Updates;
