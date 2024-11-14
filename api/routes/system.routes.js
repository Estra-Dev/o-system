import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createSystem,
  getSystem,
  removeMember,
} from "../controllers/system.controllers.js";

const router = express.Router();

router.post("/createsystem", verifyToken, createSystem);
router.get("/getsystem/:systemslug", verifyToken, getSystem);
router.put("/removemember/:systemId/:userId", removeMember);

export default router;
