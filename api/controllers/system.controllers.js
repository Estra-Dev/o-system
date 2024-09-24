import System from "../models/system.models.js";
import { errorHandler } from "../utils/error.js";

export const createSystem = async (req, res, next) => {
  if (!req.body.name || !req.body.description) {
    return next(errorHandler(403, "Please Provide all required field"));
  }

  const slug = req.body.name
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newSystem = new System({
    ...req.body,
    slug,
    ownedBy: req.user.id,
    admin: [req.user.id],
    members: [req.user.id],
  });
  try {
    const createdSystem = await newSystem.save();
    res.status(201).json(createdSystem);
  } catch (error) {
    next(error);
  }
};
