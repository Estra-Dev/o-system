import axios from "axios";
import { Button, Modal, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateError,
} from "../redux/system/systemSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { LuSearchCode } from "react-icons/lu";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const { systemDetails } = useSelector((state) => state.system);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // const [memberIdToAdd, setMemberIdToAdd] = useState("");
  // const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // console.log("usersss", memberIdToAdd);

  const getUsers = async () => {
    try {
      const res = await axios.get(`/api/user/getusers`);
      if (res.status === 200) {
        setUsers(res.data.users);
        setUsers((prev) => prev.filter((user) => user._id !== currentUser._id));

        if (users.length < 1) {
          setShowMore(false);
        } else {
          setShowMore(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async (memberId) => {
    dispatch(updateStart());
    try {
      const res = await axios.put(
        `/api/system/addmember/${systemDetails._id}/${memberId}`
      );
      if (res.status === 200) {
        console.log("added", res.data);
        dispatch(updateSuccess(res.data));
      }
    } catch (error) {
      dispatch(updateError(error.response.data.message));
      console.log(error);
    }
  };
  useEffect(() => {
    if (users.length < 1) {
      getUsers();
    }

    const urlParams = new URLSearchParams(location.search);
    const nameFromUrlParams = urlParams.get("name");
    if (nameFromUrlParams) {
      setSearch(nameFromUrlParams);
    }
  }, [location.search]);

  const searchSystem = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("name", search);
    const searchQuery = urlParams.toString();
    navigate(`/system/${systemDetails.slug}?tab=add-people&&name=${search}`);

    try {
      const res = await axios.get(`/api/user/getusers?${searchQuery}`);
      if (res.status === 200) {
        setLoading(false);
        setSearch("");
        setUsers(res.data.users);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await axios.get(
        `/api/user/getusers?startIndex=${startIndex}`
      );
      if (res.status === 200) {
        setUsers((prev) => [...prev, ...res.data.users]);
        if (res.data.users.length <= 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" w-full max-w-3xl mx-auto">
      <div className=" sticky left-0 flex items-center gap-2 border bg-gray-100 max-w-xl w-full px-3 py-2 my-6 rounded-md">
        <form
          onSubmit={searchSystem}
          className=" flex items-center gap-3 w-full"
        >
          <input
            className=" outline-none w-full bg-transparent"
            placeholder="Search..."
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
          />
          <LuSearchCode
            onClick={searchSystem}
            className=" w-6 h-6 text-gray-500 cursor-pointer"
          />
        </form>
        {/* <Button type="button">O</Button> */}
      </div>
      <h1 className=" mt-4 p-3 text-center border-b text-gray-800 font-semibold text-3xl">
        Add as member
      </h1>
      {loading ? (
        <div className=" mt-3 flex items-center gap-2 justify-center max-w-xl w-full mx-auto">
          <Spinner size={"lg"} />
          <h2 className=" text-xl font-semibold text-blue-500 text-center">
            Looking for members
          </h2>
        </div>
      ) : users.length > 0 ? (
        <div className=" p-3 flex flex-col gap-3 items-start w-full mt-6">
          {users.map(
            (user) =>
              !systemDetails.members.includes(user._id) && (
                <div key={user._id} className=" max-w-xl sm:w-full">
                  <div className=" flex items-center gap-4">
                    <div className=" flex items-center w-full gap-4">
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
                          onClick={() => handleAdd(user._id)}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          gradientDuoTone={"purpleToBlue"}
                          size={"xs"}
                          onClick={() => {
                            // setMemberIdToAdd(user._id);
                            // setModal(true);
                            handleAdd(user._id);
                          }}
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
          )}
          {showMore && (
            <button
              type="button"
              onClick={handleShowMore}
              className=" w-36 text-teal-500 self-center border rounded-lg text-sm py-2 bg-gray-100 font-semibold mt-5"
            >
              {/* {" "} */}
              Show More
            </button>
          )}
        </div>
      ) : (
        <h1>No user found</h1>
      )}

      {/* <Modal popup size={"sm"} onClose={() => setModal(false)} show={modal}>
        <Modal.Header />
        <Modal.Body>
          <div className=" text-center">
            <FaCircleExclamation className=" w-10 h-10 mx-auto mb-4 text-red-500" />
            <h3 className=" text-lg mb-4 text-gray-500">
              Please make sure you know this person
            </h3>
            <div className=" flex justify-center gap-4">
              <Button outline color={"success"} onClick={handleAdd}>
                <p>Yes, Continue</p>
              </Button>
              <Button outline onClick={() => setModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}
    </div>
  );
};

export default AllUsers;
