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
    // const slug = req.params.systemslug;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const system = await System.find({
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.systemId && { _id: req.query.systemId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.searchTerm && {
        $or: [{ name: { $regex: req.query.searchTerm, $options: "i" } }],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalSystem = await System.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthSystems = await System.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    if (!system) {
      return next(errorHandler(404, "System not found!"));
    }
    res.status(200).json({
      system,
      totalSystem,
      lastMonthSystems,
    });
    console.log(system);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const system = await System.findOne({ _id: req.params.systemId });

    const { userIdToRemove } = req.body;
    if (!system) {
      return next(errorHandler(404, "System not found"));
    }
    const isAdmin = system.admin.indexOf(req.user.id);
    if (isAdmin === -1) {
      return next(
        errorHandler(403, "You are not allowed to delete any member")
      );
    }
    const member = system.members.indexOf(userIdToRemove);

    if (system.ownedBy === userIdToRemove) {
      return next(errorHandler(403, "Cant delete this admin"));
    }
    // const removedUser = await System.findByIdAndUpdate(
    //   req.params.systemId,
    //   {
    //     $pull: { members: userIdToRemove },
    //     numberOfMembers: numberOfMembers - 1,
    //   },
    //   { new: true }
    // );
    //
    if (member === -1) {
      return next(errorHandler(403, "No such member in this System"));
    } else {
      system.numberOfMembers -= 1;
      system.members.splice(member, 1);
    }
    await system.save();
    res.status(200).json(system);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const system = await System.findById(req.params.systemId);

    // check if system exist
    if (!system) {
      return next(errorHandler(404, "System does not exist"));
    }

    // check for membership and for admin
    const memberIndex = system.members.indexOf(req.params.userId);
    const isAdmin = system.admin.indexOf(req.user.id);

    if (isAdmin === -1) {
      return next(errorHandler(403, "You are not an admin"));
    }

    // add if user is not a member or remove if user is a member
    if (memberIndex === -1) {
      system.numberOfMembers += 1;
      system.members.push(req.params.userId);
    } else {
      system.numberOfMembers -= 1;
      system.members.splice(memberIndex, 1);
    }

    await system.save();
    res.status(200).json(system);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const makeAdmin = async (req, res, next) => {
  try {
    const system = await System.findById(req.params.systemId);
    const isAdmin = system.admin.indexOf(req.user.id);
    const owner = system.ownedBy === req.user.id;
    const isMemberAdmin = system.admin.indexOf(req.params.userId);

    if (!owner) {
      return next(errorHandler(403, "You are not allowed to add an admin"));
    }

    if (!system) {
      return next(errorHandler(404, "System not found"));
    }

    if (req.params.userId === system.ownedBy) {
      // system.admin.push(req.user.id);
      return next(errorHandler(403, "Owner cannot not be removed"));
    } else {
    }

    if (isMemberAdmin === -1) {
      system.admin.push(req.params.userId);
    } else {
      system.admin.splice(isMemberAdmin, 1);
    }

    await system.save();
    res.status(200).json(system);
  } catch (error) {
    next(error);
  }
};

// export const getSystems = async (req, res, next) => {
//   try {
//     if (!req.user.id) {
//       return next(errorHandler(403, "You can't access systems"));
//     }
//     const systems = await System.find();
//     res.status(200).json(systems);
//   } catch (error) {
//     next(error);
//   }
// };

export const joinSystem = async (req, res, next) => {
  try {
    const system = await System.findById(req.params.systemId);
    const memberIndex = system.joinRequest.indexOf(req.user.id);

    if (!system) {
      return next(errorHandler(404, "System not found"));
    }
    if (!req.user.id) {
      return next(errorHandler(403, "User not verified"));
    }

    if (memberIndex === -1) {
      system.numberOfJoinRequest += 1;
      system.joinRequest.push(req.user.id);
    } else {
      system.numberOfJoinRequest -= 1;
      system.joinRequest.splice(memberIndex, 1);
    }
    await system.save();
    res.status(200).json(system);
  } catch (error) {
    next(error);
  }
};

export const admit = async (req, res, next) => {
  try {
    const system = await System.findById(req.params.systemId);
    const userIndex = system.joinRequest.indexOf(req.params.userId);
    const memberIndex = system.members.indexOf(req.params.userId);

    if (memberIndex === -1) {
      system.numberOfMembers += 1;
      system.members.push(req.params.userId);
    } else {
      system.numberOfMembers -= 1;
      system.members.splice(memberIndex, 1);
    }
    if (userIndex === -1) {
      return next(errorHandler(404, "No Such request found"));
    } else {
      system.numberOfJoinRequest -= 1;
      system.joinRequest.splice(userIndex, 1);
    }
    if (!system) {
      return next(errorHandler(404, "System not found"));
    }
    await system.save();
    res.status(200).json(system);
  } catch (error) {
    next(error);
  }
};
