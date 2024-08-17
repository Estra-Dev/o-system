import User from "../api/models/user.models.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
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
    return res.status(400).json({ message: "All fields are required" });
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
    res.status(500).json({ message: error.message });
  }
};
