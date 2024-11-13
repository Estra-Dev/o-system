import User from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import Matter from "../models/matter.model.js";
import System from "../models/system.models.js";

export const test = (req, res) => {
  res.json({ message: "API is still working" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to Update this user"));
  }
  if (req.body.password) {
    if (req.body.password < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  if (req.body.firstname) {
    if (req.body.firstname.length < 3 || req.body.firstname.length > 15) {
      return next(
        errorHandler(400, "First Name must be between 2 to 15 characters")
      );
    }
    if (req.body.firstname.includes(" ")) {
      return next(errorHandler(400, "First Name cannot contain space"));
    }
    if (!req.body.firstname.match(/^[a-zA-Z]+$/)) {
      return next(errorHandler(400, "First Name can only contain Letters"));
    }
  }
  if (req.body.lastname) {
    if (req.body.lastname.length < 3 || req.body.lastname.length > 15) {
      return next(
        errorHandler(400, "Last Name must be between 2 to 15 characters")
      );
    }
    if (req.body.lastname.includes(" ")) {
      return next(errorHandler(400, "Last Name cannot contain space"));
    }
    if (!req.body.lastname.match(/^[a-zA-Z]+$/)) {
      return next(errorHandler(400, "Last Name can only contain Letters"));
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    await Matter.updateMany(
      { userId: req.params.userId },
      {
        $set: {
          userProfileImage: updatedUser.profilePicture,
        },
      }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return next(errorHandler(400, "This user already exist"));
    } else {
      next(error);
    }
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    next(errorHandler(400, "You are not allowed to Burn this account!!!"));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("Account has been Burnt.");
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("You have successfully signed out");
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    // const system = await System.findById(req.params.systemId);
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .limit(limit)
      .skip(startIndex);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUser = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res
      .status(200)
      .json({ users: usersWithoutPassword, totalUser, lastMonthUsers });
  } catch (error) {
    next(error);
  }
};
