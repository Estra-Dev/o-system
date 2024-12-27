import axios from "axios";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { IoTrashBinOutline } from "react-icons/io5";
import { FaCircleExclamation, FaRegTrashCan } from "react-icons/fa6";
import {
  updateStart,
  updateSuccess,
  updateError,
} from "../redux/system/systemSlice";
import { LuSearchCode } from "react-icons/lu";

const SystemMembers = () => {
  // const params = useParams();
  // const [systemDetails, setSystemDetails] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { systemDetails } = useSelector((state) => state.system);
  const membersCount = [];
  const [fetchedMembers, setFetchedMembers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [userIdToRemove, setUserIdToRemove] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  // const [removeError, setRemoveError] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // const getSystem = async () => {
  //   try {
  //     const res = await axios.get(`/api/system/getsystem/${params.slug}`);
  //     // console.log("wetin", res);
  //     if (res.status === 200) {
  //       setSystemDetails(res.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getUsers = async () => {
    try {
      const res = await axios.get(`/api/user/getusers`);
      if (res.status === 200) {
        setFetchedMembers(res.data.users);
        // console.log("All users poem", res.data);
        if (res.data.users.length < 9) {
          setShowMore(false);
        } else {
          setShowMore(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // if (fetchedMembers) {
  //   fetchedMembers.map((member) => {
  //     if (systemDetails.members.includes(member._id)) {
  //       membersCount.push(member);
  //     }
  //   });
  // }

  const handleShowMore = async () => {
    const startIndex = membersCount.length;
    try {
      const res = await axios.get(
        `/api/user/getusers?startIndex=${startIndex}`
      );
      if (res.status === 200) {
        setFetchedMembers((prev) => [...prev, ...res.data.users]);
        if (res.data.users.length <= 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveMember = async () => {
    dispatch(updateStart());
    try {
      const res = await axios.put(
        `/api/system/removemember/${systemDetails._id}/${currentUser._id}`,
        { userIdToRemove }
      );

      if (res.status === 200) {
        dispatch(updateSuccess(res.data));
        membersCount.filter((member) => member._id !== userIdToRemove);
        setOpenModal(false);
        getUsers();
      }
    } catch (error) {
      setOpenModal(false);
      console.log(error.response.data.message);
      dispatch(updateError(error.response.data.message));
    }
    console.log("Removed");
  };

  // console.log("first fetch", membersCount);

  useEffect(() => {
    if (fetchedMembers.length < 1) {
      getUsers();
    }
    // getSystem();
    const urlParams = new URLSearchParams(location.search);
    const nameFromUrlParams = urlParams.get("name");
    if (nameFromUrlParams) {
      setSearch(nameFromUrlParams);
    }
  }, [location.search]);

  const handleMakeAdmin = async (userId) => {
    dispatch(updateStart());
    try {
      const res = await axios.put(
        `/api/system/makeadmin/${systemDetails._id}/${userId}`
      );
      if (res.status === 200) {
        dispatch(updateSuccess(res.data));
      }
    } catch (error) {
      console.log(error);
      dispatch(updateError(error.response.data.message));
    }
  };

  const searchSystem = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("name", search);
    const searchQuery = urlParams.toString();
    navigate(`/system/${systemDetails.slug}?tab=members&&name=${search}`);

    try {
      const res = await axios.get(`/api/user/getusers?${searchQuery}`);
      if (res.status === 200) {
        setLoading(false);
        setSearch("");
        setFetchedMembers(res.data.users);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className=" table-auto overflow-x-scroll md:mx-auto p-3">
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
      {loading ? (
        <div className=" mt-3 flex items-center gap-2 justify-center max-w-xl w-full mx-auto">
          <Spinner size={"lg"} />
          <h2 className=" text-xl font-semibold text-blue-500 text-center">
            Looking for members
          </h2>
        </div>
      ) : fetchedMembers.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md">
            <Table.Head>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Remove </Table.HeadCell>
              <Table.HeadCell>Add as Admin</Table.HeadCell>
            </Table.Head>
            {fetchedMembers.map(
              (member) =>
                systemDetails &&
                systemDetails.members.includes(member._id) && (
                  <Table.Body className=" divide-y" key={member._id}>
                    <Table.Row className=" bg-white">
                      <Table.Cell>
                        <img
                          src={member.profilePicture}
                          className=" w-10 h-10 rounded-full object-cover blur-sm"
                          alt=""
                        />
                      </Table.Cell>
                      <Table.Cell>
                        {member.firstname + " " + member.lastname}
                      </Table.Cell>
                      <Table.Cell>{member.email}</Table.Cell>
                      <Table.Cell>
                        {systemDetails &&
                        systemDetails.admin.includes(member._id) ? (
                          <p className=" bg-lime-500/80 text-white rounded-full text-xs p-2">
                            Admin
                          </p>
                        ) : (
                          <p> </p>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          size={"xs"}
                          onClick={() => {
                            setOpenModal(true);
                            setUserIdToRemove(member._id);
                          }}
                          gradientDuoTone={"purpleToPink"}
                          outline
                          className=" text-red-600"
                        >
                          <IoTrashBinOutline />
                        </Button>
                      </Table.Cell>
                      <Table.Cell>
                        {systemDetails.owned === currentUser._id ? (
                          ""
                        ) : systemDetails.admin.includes(member._id) ? (
                          <button
                            type="button"
                            className=" font-semibold text-red-500 text-xl"
                            onClick={() => handleMakeAdmin(member._id)}
                          >
                            -
                          </button>
                        ) : (
                          <button
                            type="button"
                            className=" font-semibold text-cyan-500 text-xl"
                            onClick={() => handleMakeAdmin(member._id)}
                          >
                            +
                          </button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                )
            )}
          </Table>
          {showMore && (
            <button
              type="button"
              onClick={handleShowMore}
              className=" w-full text-teal-500 self-center text-sm py-5"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <h1>No member found</h1>
      )}

      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className=" text-center">
            <FaCircleExclamation className=" w-10 h-10 mx-auto mb-4 text-red-500" />
            <h3 className=" text-lg mb-4 text-gray-500">
              Are You sure you want to remove this Person?
            </h3>
            <div className=" flex justify-center gap-4">
              <Button outline color={"failure"} onClick={handleRemoveMember}>
                <FaRegTrashCan className=" text-red-500 text-lg" />
              </Button>
              <Button outline onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SystemMembers;
