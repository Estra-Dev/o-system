import Matter from "../models/matter.model.js";
import System from "../models/system.models.js";
import User from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";

export const createMatters = async (req, res, next) => {
  try {
    const system = await System.findById(req.params.systemId);

    const member = await User.findById(req.user.id);
    if (!system.members.includes(req.user.id)) {
      return next(errorHandler(403, "You are not allowed to Publish a matter"));
    }
    if (!req.body.content) {
      return next(errorHandler(403, "Provide a content for this matter"));
    }

    const newMatter = new Matter({
      ...req.body,
      userId: member._id,
      systemId: system._id,
      system_name: system.name,
      anon_name: member.anon_name,
    });

    const savedMatter = await newMatter.save();
    res.status(201).json(savedMatter);
  } catch (error) {
    next(error);
  }
};

export const getMatters = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const matters = await Matter.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.systemId && { systemId: req.query.systemId }),
      ...(req.query.matterId && { _id: req.query.matterId }),
      ...(req.query.searchTerm && {
        $or: [{ content: { $regex: req.query.searchTerm, $options: "i" } }],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    console.log(matters);
    const totalMatters = await Matter.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthMatters = await Matter.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ matters, totalMatters, lastMonthMatters });
  } catch (error) {
    next(error);
  }
};
