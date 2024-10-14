import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createMatters,
  getMatters,
} from "../controllers/matters.controllers.js";

const router = express.Router();

router.post("/creatematter/:systemId", verifyToken, createMatters);
router.get("/getmatters", getMatters);

export default router;
