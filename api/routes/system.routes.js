import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  // addMattersToMattersArr,
  createSystem,
  getSystem,
} from "../controllers/system.controllers.js";

const router = express.Router();

router.post("/createsystem", verifyToken, createSystem);
router.get("/getsystem/:systemslug", verifyToken, getSystem);
// router.put(
//   "/addmatterstomattersarr/:systemId/:matterId",
//   addMattersToMattersArr
// );

export default router;
