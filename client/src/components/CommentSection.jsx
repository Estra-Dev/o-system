import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment";
import { FaCircleExclamation, FaRegTrashCan } from "react-icons/fa6";

const CommentSection = ({ matterId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { systemDetails } = useSelector((state) => state.system);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [modal, setModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await axios.post(`/api/comment/create/${systemDetails._id}`, {
        content: comment,
        matterId,
        userId: currentUser._id,
      });

      if (res.status === 200) {
        setComment("");
        setCommentError(null);
        setComments([res.data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.response.data.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get(`/api/comment/getcomments/${matterId}`);
        if (res.status === 200) {
          setComments(res.data);
        }
      } catch (error) {
        console.log(error);
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

  const handleDelete = async (commentId) => {
    setModal(false);
    try {
      const res = await axios.delete(
        `/api/comment/deletecomment/${systemDetails._id}/${commentId}`
      );

      if (res.status === 200) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.response.data.message);
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
      {((currentUser && systemDetails.members.includes(currentUser._id)) ||
        systemDetails.ownedBy === currentUser._id) && (
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
            <Button
              outline
              gradientDuoTone={"purpleToBlue"}
              type="submit"
              size={"xs"}
            >
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
                onDelete={(commentId) => {
                  setModal(true);
                  setCommentToDelete(commentId);
                }}
              />
            ))}
        </>
      )}

      <Modal popup size={"sm"} onClose={() => setModal(false)} show={modal}>
        <Modal.Header />
        <Modal.Body>
          <div className=" text-center">
            <FaCircleExclamation className=" w-10 h-10 mx-auto mb-4 text-red-500" />
            <h3 className=" text-lg mb-4 text-gray-500">
              Are You sure you want to delete this comment?
            </h3>
            <div className=" flex justify-center gap-4">
              <Button
                outline
                color={"failure"}
                onClick={() => handleDelete(commentToDelete)}
              >
                <FaRegTrashCan className=" text-red-500 text-lg" />
              </Button>
              <Button outline onClick={() => setModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CommentSection;
