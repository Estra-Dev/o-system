import express from "express";
import {
  deleteUser,
  getUser,
  signOut,
  test,
  updateUser,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.get("/getuser/:userId", verifyToken, getUser);
router.post("/signout", signOut);

export default router;
