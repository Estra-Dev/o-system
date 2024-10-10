import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createMatters } from "../controllers/matters.controllers.js";

const router = express.Router();

router.post("/creatematter/:systemId", verifyToken, createMatters);

export default router;
