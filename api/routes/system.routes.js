import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createSystem, getSystem } from "../controllers/system.controllers.js";

const router = express.Router();

router.post("/createsystem", verifyToken, createSystem);
router.get("/getsystem/:systemslug", verifyToken, getSystem);

export default router;
