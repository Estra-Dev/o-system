import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createMatters,
  deleteMatter,
  getMatters,
  likeMatter,
  updateMatter,
} from "../controllers/matters.controllers.js";

const router = express.Router();

router.post("/creatematter/:systemId", verifyToken, createMatters);
router.get("/getmatters", getMatters);
router.delete(
  "/deletematter/:matterId/:systemId/:userId",
  verifyToken,
  deleteMatter
);
router.put("/updatematter/:matterId/:userId", verifyToken, updateMatter);
router.put("/likematter/:matterId", verifyToken, likeMatter);

export default router;
