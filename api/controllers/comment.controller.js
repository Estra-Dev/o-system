import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, matterId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, "Unauthorize..."));
    }

    const newComment = new Comment({
      content,
      matterId,
      userId,
    });

    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ matterId: req.params.matterId }).sort(
      { createdAt: -1 }
    );
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
