import express from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
  likeComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create/systemId", verifyToken, createComment);
router.get("/getcomments/:matterId", getComments);
router.put("/likecomment/:commentId", verifyToken, likeComment);
router.put("/editcomment/:systemId/:commentId", verifyToken, editComment);
router.delete(
  "/deletecomment/:systemId/:commentId",
  verifyToken,
  deleteComment
);

export default router;
