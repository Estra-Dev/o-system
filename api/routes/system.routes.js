import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  addMember,
  admit,
  createSystem,
  getSystem,
  getSystems,
  joinSystem,
  makeAdmin,
  removeMember,
} from "../controllers/system.controllers.js";

const router = express.Router();

router.post("/createsystem", verifyToken, createSystem);
router.get("/getsystem/:systemslug", verifyToken, getSystem);
router.get("/getsystems", verifyToken, getSystems);
router.put("/removemember/:systemId/:userId", verifyToken, removeMember);
router.put("/addmember/:systemId/:userId", verifyToken, addMember);
router.put("/makeadmin/:systemId/:userId", verifyToken, makeAdmin);
router.put("/joinsystem/:systemId/:userId", verifyToken, joinSystem);
router.put("/admit/:systemId/:userId", verifyToken, admit);

export default router;
