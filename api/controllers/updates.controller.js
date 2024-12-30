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

export const getUpdates = async (req, res, next) => {
  try {
    const updates = await Updates.find().sort({ createdAt: -1 });
    res.status(200).json(updates);
  } catch (error) {
    next(error);
  }
};

export const deleteUpdate = async (req, res, next) => {
  try {
    const update = await Updates.findById(req.params.updateId);

    if (!update) {
      return next(errorHandler(403, "Update does not exist"));
    }
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are allowed to delete this update"));
    }

    await Updates.findByIdAndDelete(req.params.updateId);
    res.status(200).json("Update Deleted");
  } catch (error) {
    next(error);
  }
};
