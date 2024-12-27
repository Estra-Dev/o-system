import { Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";

const Updates = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [update, setUpdate] = useState("");

  return (
    <div>
      {currentUser.isAdmin && (
        <form>
          <div className="">
            <Textarea
              placeholder="Drop Update..."
              rows={"3"}
              maxLength={"200"}
              onChange={(e) => setUpdate(e.target.value)}
              value={update}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Updates;
