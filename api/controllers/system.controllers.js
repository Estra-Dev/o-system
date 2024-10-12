import System from "../models/system.models.js";
import { errorHandler } from "../utils/error.js";

export const createSystem = async (req, res, next) => {
  const { name } = req.body;
  const systemExist = await System.findOne({ name });

  if (systemExist) {
    return next(errorHandler(400, "This System name has already been taken!"));
  }

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
    console.log(newSystem);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const getSystem = async (req, res, next) => {
  try {
    const slug = req.params.systemslug;
    const system = await System.findOne({ slug });

    console.log(system, slug);
    console.log(req.params);

    if (!system) {
      return next(errorHandler(404, "System not found!"));
    }
    res.status(200).json(system);
  } catch (error) {
    next(error);
  }
};

export const addMattersToMattersArr = async (req, res, next) => {
  const system = await System.findOne({ _id: req.params.systemId });
  try {
    const addAMatter = await System.findByIdAndUpdate(
      req.params.systemId,
      {
        $push: {
          matters: { $each: [req.params.matterId] },
        },
        $set: {
          numberOfMatters: system.matters.length,
        },
      },
      { new: true }
    ).exec();
    res.status(200).json(addAMatter);
    console.log("matters", addAMatter);
  } catch (error) {
    next(error);
  }
};
