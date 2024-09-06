import User from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

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

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
