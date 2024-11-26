import { Avatar } from "flowbite-react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FaCircleExclamation, FaRegTrashCan } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";

const Matter = ({ matter, onConfirm, onDelete }) => {
  const { systemDetails } = useSelector((state) => state.system);
  const { currentUser } = useSelector((state) => state.user);

  const [matterIdToDelete, setMatterIdToDelete] = useState("");
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className=" shadow-lg mb-3 p-5 rounded-md bg-white w-full">
      <div className="first flex justify-start gap-2 whitespace-nowrap text-xs sm:text-sm w-full">
        <div className=" w-14 h-10 rounded-full overflow-hidden">
          <Avatar alt="user" img={matter.userProfileImage} rounded />
        </div>
        <p className=" text-xs truncate text-orange-400">
          {matter && matter.anon_name}
        </p>
        <p className=" text-xs truncate">{matter && matter.system_name}</p>
        <p className=" text-xs truncate">
          {matter && new Date(matter.updatedAt).toLocaleString()}
        </p>
      </div>
      <div className="second max-w-3xl w-full flex flex-col items-end">
        <div className=" w-[90%] rounded-md relative">
          <p
            className=" text-gray-900 font-semibold text-sm my-3"
            dangerouslySetInnerHTML={{
              __html: matter && matter.content,
            }}
          ></p>

          {matter && matter.image && (
            <img
              src={matter && matter.image}
              className={` w-full rounded-md my-2}`}
              alt="post image"
            />
          )}
          <div className="reactions flex items-center gap-3 py-2 mt-3 text-xs border-t-2">
            <button
              type="button"
              className={` text-gray-400 hover:text-green-500 ${
                matter.likes.includes(currentUser._id) && "text-green-500"
              }`}
              onClick={() => onConfirm(matter._id)}
            >
              <FaCheckCircle className=" text-lg" />
            </button>
            <p>
              {matter.likes.length > 0 &&
                matter.likes.length +
                  " " +
                  (matter.likes.length === 1
                    ? "Confirmation"
                    : "Confirmations")}
            </p>
            <Link
              to={`/system/${systemDetails.slug}/${matter._id}?tab=thismatter`}
            >
              Contributes
            </Link>
            {matter.userId === currentUser._id &&
              systemDetails.admin.includes(currentUser._id) && (
                <span
                  className=" cursor-pointer"
                  onClick={() => onDelete(matter._id)}
                >
                  <FaRegTrashCan className=" text-red-600 text-lg" />
                </span>
              )}
            {matter.userId === currentUser._id && (
              <Link to={`/update-matter/${matter._id}`}>
                <span className=" cursor-pointer">
                  <CiEdit className=" text-blue-600 text-lg font-semibold" />
                </span>
              </Link>
            )}
            {/* <span>Important</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matter;
