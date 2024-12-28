import { Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { TiEdit } from "react-icons/ti";
import { RiDeleteBin7Fill } from "react-icons/ri";

const SingleUpdates = ({ update, onDelete }) => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className=" w-full p-4 bg-lime-50/50 rounded-md text-gray-700 font-semibold text-lg">
      <p className=" pl-4">{update.content}</p>
      {currentUser.isAdmin && (
        <div className=" flex gap-5 mt-4 text-gray-700">
          <button type="button">
            <TiEdit className=" w-7 border-b-2 pb-1 cursor-pointer h-7" />
          </button>
          <button type="button" onClick={() => onDelete(update._id)}>
            <RiDeleteBin7Fill className=" w-7 border-b-2 pb-1 cursor-pointer h-7 text-red-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SingleUpdates;
