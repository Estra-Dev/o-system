import axios from "axios";
import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { useSelector } from "react-redux";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const { systemDetails } = useSelector((state) => state.system);
  const [memberIdToAdd, setMemberIdToAdd] = useState("");
  const [modal, setModal] = useState(false);

  console.log("usersss", memberIdToAdd);

  const getUsers = async () => {
    try {
      const res = await axios.get(`/api/user/getusers`);
      if (res.status === 200) {
        setUsers(res.data.users);
        setUsers((prev) => prev.filter((user) => user._id !== currentUser._id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    setModal(false);
    try {
      const res = await axios.put(
        `/api/system/addmember/${systemDetails._id}/${memberIdToAdd}`
      );
      if (res.status === 200) {
        console.log("added", res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className=" w-full max-w-3xl mx-auto">
      <h1 className=" mt-4 p-3 border-b text-gray-800 font-semibold text-3xl">
        Add as member
      </h1>
      <div className=" p-3 flex flex-col gap-3 items-start w-full mt-6">
        {users.map((user) => (
          <div key={user._id} className=" flex items-center w-full gap-4">
            <img
              src={user.profilePicture}
              alt="user"
              className=" w-10 h-10 object-cover rounded-full"
            />
            <div className=" flex flex-col mb-2 flex-1">
              <h2 className=" text-gray-700">
                {user.firstname + " " + user.lastname}
              </h2>
              <i className=" text-xs text-blue-600">@{user.email}</i>
            </div>
            {systemDetails.members.includes(user._id) ? (
              <Button
                type="button"
                gradientDuoTone={"purpleToBlue"}
                size={"xs"}
                outline
              >
                Remove
              </Button>
            ) : (
              <Button
                type="button"
                gradientDuoTone={"purpleToBlue"}
                size={"xs"}
                onClick={() => {
                  setMemberIdToAdd(user._id);
                  setModal(true);
                }}
              >
                Add
              </Button>
            )}
          </div>
        ))}
      </div>

      <Modal popup size={"sm"} onClose={() => setModal(false)} show={modal}>
        <Modal.Header />
        <Modal.Body>
          <div className=" text-center">
            <FaCircleExclamation className=" w-10 h-10 mx-auto mb-4 text-red-500" />
            <h3 className=" text-lg mb-4 text-gray-500">
              Please make sure you know this person
            </h3>
            <div className=" flex justify-center gap-4">
              <Button outline color={"failure"} onClick={handleAdd}>
                <p>Yes, Continue</p>
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

export default AllUsers;
