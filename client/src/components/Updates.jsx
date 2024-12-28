import { Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import SingleUpdates from "./SingleUpdates";

const Updates = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [updates, setUpdates] = useState("");
  const [newUpdates, setNewUpdates] = useState([]);

  console.log(updates);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const res = await axios.post(
        `/api/updates/create`,
        {
          updates,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 201) {
        setNewUpdates([res.data, ...newUpdates]);
        setUpdates("");
        console.log("newUpdates", res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUpdates = async () => {
    try {
      const res = await axios.get(`/api/updates/getupdates`);
      if (res.status === 200) {
        setNewUpdates(res.data);
        console.log("gooten", newUpdates);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUpdates();
  }, []);

  const handleDelete = async (updateId) => {
    try {
      const res = await axios.delete(`/api/updates/deleteupdate/${updateId}`);

      if (res.status === 200) {
        setNewUpdates(newUpdates.filter((update) => update._id !== updateId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" max-w-sm mx-auto p-5">
      {currentUser.isAdmin && (
        <form className=" w-full mb-7" onSubmit={handleSubmit}>
          <div className=" w-full flex gap-3 items-end">
            <Textarea
              placeholder="Drop Update..."
              rows={"3"}
              maxLength={"200"}
              onChange={(e) => setUpdates(e.target.value)}
              value={updates}
            />
            <Button
              outline
              gradientDuoTone={"purpleToBlue"}
              type="submit"
              size={"xs"}
            >
              Drop
            </Button>
          </div>
        </form>
      )}
      {newUpdates &&
        newUpdates.map((newUpdate) => (
          <div
            key={newUpdate._id}
            className=" w-full shadow-md flex items-center flex-col mt-5"
          >
            <SingleUpdates
              key={newUpdate._id}
              update={newUpdate}
              onDelete={handleDelete}
            />
          </div>
        ))}
    </div>
  );
};

export default Updates;
