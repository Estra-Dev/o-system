import { Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

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
        setNewUpdates([...newUpdates, res.data]);
        console.log("newUpdates", res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" max-w-3xl mx-auto p-5">
      {currentUser.isAdmin && (
        <form className=" w-full" onClick={handleSubmit}>
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
      <div className=" w-full flex items-center flex-col gap-3">
        <h1>Update card goes here</h1>
        <h1>Update card goes here</h1>
        <h1>Update card goes here</h1>
      </div>
    </div>
  );
};

export default Updates;
