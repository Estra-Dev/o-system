import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { firstname, lastname, anon_name, email, password } = req.body;

  if (
    !firstname ||
    !lastname ||
    !anon_name ||
    !email ||
    !password ||
    firstname === "" ||
    lastname === "" ||
    anon_name === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    firstname,
    lastname,
    anon_name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json({ message: "Successfully registered" });
    console.log(newUser);
  } catch (error) {
    next(error);
  }
};
