import Comment from "../models/comment.model.js";
import System from "../models/system.models.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  const system = await System.findById(req.params.systemId);
  const member = system.members.indexOf(req.user.id);

  if (!member) {
    return next(
      errorHandler(
        403,
        "You are not permitted to comment here, become a member first"
      )
    );
  }
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

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment does not exist"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const system = await System.findById(req.params.systemId);
    const admin = system.admin.indexOf(req.user.id);
    if (!comment) {
      return next(errorHandler(404, "comment not found"));
    }
    if (comment.userId !== req.user.id && !admin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment")
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const system = await System.findById(req.params.systemId);

    const admin = system.admin.indexOf(req.user.id);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !admin) {
      return next(errorHandler(403, "You are not allowed to this comment"));
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment Deleted");
  } catch (error) {
    next(error);
  }
};
