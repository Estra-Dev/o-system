import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createSystem } from "../controllers/system.controllers.js";

const router = express.Router();

router.post("/createsystem", verifyToken, createSystem);

export default router;
