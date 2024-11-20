import { useSelector } from "react-redux";
// import User from "../../../api/models/user.models";
import { Link } from "react-router-dom";
import { Alert, Button, Textarea } from "flowbite-react";
import { useState } from "react";
import axios from "axios";

const CommentSection = ({ matterId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

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
      }
      console.log("first comment", res.data);
    } catch (error) {
      console.log(error);
      setCommentError(error.response.data.message);
    }
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
    </div>
  );
};

export default CommentSection;