import Updates from "../models/update.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  const { updates } = req.body;
  if (!updates) {
    return next(errorHandler(403, "Fill all necessary fields"));
  }

  try {
    const newUpdate = new Updates({
      content: updates,
    });
    await newUpdate.save();
    res.status(201).json(newUpdate);
  } catch (error) {
    next(error);
  }
};
