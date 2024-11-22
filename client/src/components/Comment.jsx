import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Alert, Button, Textarea } from "flowbite-react";

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [commentError, setCommentError] = useState(null);

  const { currentUser } = useSelector((state) => state.user);
  const { systemDetails } = useSelector((state) => state.system);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/user/getuser/${comment.userId}`);

        if (res.status === 200) {
          setUser(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  const handelSave = async () => {
    try {
      const res = await axios.put(
        `/api/comment/editcomment/${systemDetails._id}/${comment._id}`,
        { content: editedContent }
      );

      if (res.status === 200) {
        setEdit(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  return (
    <div className=" flex border-b p-4 text-sm">
      <div className=" flex-shrink-0 mr-3">
        <img
          className=" w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.profilePicture}
        />
      </div>
      <div className=" flex-1">
        <div className=" flex items-center mb-1">
          <span className=" font-semibold text-xs mr-3 truncate">
            {user ? `@${user.anon_name}` : <p>Unknown user</p>}
          </span>
          <span className=" text-xs text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {edit ? (
          // <form
          //   onSubmit={handleSubmit}
          //   className=" borber border-[1px] border-teal-500 rounded-md p-3"
          // >

          //   <div className=" flex justify-between items-center mt-5">
          //     <p className=" text-gray-500 text-xs">
          //       {200 - comment.length} Characters remaining
          //     </p>
          //     <Button outline gradientDuoTone={"purpleToBlue"} type="submit">
          //       Drop
          //     </Button>
          //   </div>
          //   {commentError && (
          //     <Alert color={"failure"} className=" mt-5">
          //       {commentError}
          //     </Alert>
          //   )}
          // </form>

          <>
            <Textarea
              className=" mb-2"
              placeholder="Edit your contribution..."
              onChange={(e) => setEditedContent(e.target.value)}
              value={editedContent}
            />
            <div className=" flex justify-end items-center gap-2 text-xs">
              <Button
                gradientDuoTone={"purpleToBlue"}
                outline
                type="button"
                size={"xs"}
                onClick={handelSave}
              >
                Save
              </Button>
              <Button
                gradientDuoTone={"purpleToBlue"}
                outline
                type="button"
                size={"xs"}
                onClick={() => setEdit(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className=" text-gray-500 pb-2">{comment.content}</p>
            <div className=" flex items-center gap-2 pt-2 text-xs border-t max-w-fit">
              <button
                type="button"
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp className=" text-sm" />
              </button>
              <p className=" text-gray-400">
                {comment.likes.length > 0 &&
                  comment.likes.length +
                    " " +
                    (comment.likes.length === 1 ? "Like" : " Likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment._id ||
                  systemDetails.admin.includes(currentUser._id)) && (
                  <button
                    type="button"
                    className=" text-gray-400 hover:text-blue-500"
                    onClick={() => setEdit(true)}
                  >
                    Edit
                  </button>
                )}
              {currentUser &&
                (currentUser._id === comment._id ||
                  systemDetails.admin.includes(currentUser._id)) && (
                  <button
                    type="button"
                    className=" text-gray-400 hover:text-red-500"
                    onClick={() => onDelete(comment._id)}
                  >
                    Delete
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
