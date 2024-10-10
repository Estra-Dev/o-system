import Matter from "../models/matter.model.js";
import System from "../models/system.models.js";
import { errorHandler } from "../utils/error.js";

export const createMatters = async (req, res, next) => {
  try {
    const system = await System.findById(req.params.systemId);

    if (!system.members.includes(req.user.id)) {
      return next(errorHandler(403, "You are not allowed to Publish a matter"));
    }
    if (!req.body.content) {
      return next(errorHandler(403, "Provide a content for this matter"));
    }

    const newMatter = new Matter({
      ...req.body,
      userId: req.user.id,
      systemId: system._id,
    });

    const savedMatter = await newMatter.save();
    res.status(201).json(savedMatter);

    // await system.matters.push(savedMatter._id);
  } catch (error) {
    next(error);
  }
};
