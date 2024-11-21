import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

const Comment = ({ comment, onLike }) => {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  console.log("first user", user);
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
        </div>
      </div>
    </div>
  );
};

export default Comment;
