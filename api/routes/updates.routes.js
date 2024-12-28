import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  deleteUpdate,
  getUpdates,
} from "../controllers/updates.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getupdates", getUpdates);
router.delete("/deleteupdate/:updateId", verifyToken, deleteUpdate);

export default router;
