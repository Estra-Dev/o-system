import { Button, Textarea } from "flowbite-react";
import { useSelector } from "react-redux";
import { TiEdit } from "react-icons/ti";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { useState } from "react";
import axios from "axios";

const SingleUpdates = ({ update, onDelete, onEdit }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [edit, setEdit] = useState(false);
  const [editedContent, setEditedContent] = useState(update.content);

  const handleSave = async (ev) => {
    ev.preventDefault();
    try {
      const res = await axios.put(`/api/updates/editupdate/${update._id}`, {
        updates: editedContent,
      });

      if (res.status === 200) {
        setEdit(false);
        onEdit(update, editedContent);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" w-full p-4 bg-lime-50/50 rounded-md text-gray-700 font-semibold text-lg">
      {edit ? (
        <form>
          <div className=" w-full flex gap-3 items-end">
            <Textarea
              placeholder="Drop Update..."
              rows={"3"}
              maxLength={"200"}
              onChange={(e) => setEditedContent(e.target.value)}
              value={editedContent}
            />
            <Button
              outline
              gradientDuoTone={"purpleToBlue"}
              type="submit"
              size={"xs"}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              outline
              gradientDuoTone={"purpleToBlue"}
              type="submit"
              size={"xs"}
              onClick={() => setEdit(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <p className=" pl-4">{update.content}</p>
          {currentUser.isAdmin && (
            <div className=" flex gap-5 mt-4 text-gray-700">
              <button type="button" onClick={() => setEdit(true)}>
                <TiEdit className=" w-7 border-b-2 pb-1 cursor-pointer h-7" />
              </button>
              <button type="button" onClick={() => onDelete(update._id)}>
                <RiDeleteBin7Fill className=" w-7 border-b-2 pb-1 cursor-pointer h-7 text-red-600" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SingleUpdates;
