import { useSelector } from "react-redux";
// import User from "../../../api/models/user.models";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment";

const CommentSection = ({ matterId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await axios.post(`/api/comment/create`, {
        content: comment,
        matterId,
        userId: currentUser._id,
      });

      if (res.status === 200) {
        setComment("");
        setCommentError(null);
        setComments([res.data, ...comments]);
      }
      console.log("first comment", res.data);
    } catch (error) {
      console.log(error);
      setCommentError(error.response.data.message);
    }
  };

  console.log("all comments", comments);

  useEffect(() => {
    const getComments = async () => {
      const res = await axios.get(`/api/comment/getcomments/${matterId}`);
      if (res.status === 200) {
        setComments(res.data);
      }
    };
    getComments();
  }, [matterId]);

  // like functionality
  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await axios.put(`/api/comment/likecomment/${commentId}`);
      if (res.status === 200) {
        console.log("liked", res.data);
        setComments(
          comments.map((comment) =>
            comment._id == commentId
              ? {
                  ...comment,
                  likes: res.data.likes,
                  numberOfLikes: res.data.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleEdit = (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  return (
    <div className=" max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className=" flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className=" h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt={currentUser.profilePicture}
          />
          <Link
            to={"/dashboard?tab=profile"}
            className=" text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.anon_name}
          </Link>
        </div>
      ) : (
        <div className="">
          <p>You must be signed in to comment</p>
          <Link to={"/sign-in"}>Sign In</Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className=" borber border-[1px] border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Drop your contribution..."
            rows={"3"}
            maxLength={"200"}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className=" flex justify-between items-center mt-5">
            <p className=" text-gray-500 text-xs">
              {200 - comment.length} Characters remaining
            </p>
            <Button outline gradientDuoTone={"purpleToBlue"} type="submit">
              Drop
            </Button>
          </div>
          {commentError && (
            <Alert color={"failure"} className=" mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className=" text-sm my-5">No contributions yet!</p>
      ) : (
        <>
          <div className=" flex items-center gap-2 text-sm my-5">
            <p>Contributions</p>
            <div className=" border px-2 py-1 rounded-sm border-gray-400">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments &&
            comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onLike={handleLike}
                onEdit={handleEdit}
              />
            ))}
        </>
      )}
    </div>
  );
};

export default CommentSection;
