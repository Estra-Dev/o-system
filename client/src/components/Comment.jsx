import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";

const Comment = ({ comment }) => {
  const [user, setUser] = useState({});

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
      </div>
    </div>
  );
};

export default Comment;
