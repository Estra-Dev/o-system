import { Schema, model } from "mongoose";

const systemSchema = Schema(
  {
    ownedBy: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default:
        "http://ts1.mm.bing.net/th?id=OIP.z1qiTo8DMqQhhAtW7NfLsQHaHa&pid=15.1",
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    admin: {
      type: Array,
      default: [],
    },
    members: {
      type: Array,
      default: [],
    },
    numberOfMembers: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Array,
      default: [],
    },
    numberOfFollowers: {
      type: Number,
      default: 0,
    },
    joinRequest: {
      type: Array,
      default: [],
    },
    numberOfJoinRequest: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: "uncategorize",
    },
  },
  { timestamps: true }
);

const System = model("System", systemSchema);

export default System;
