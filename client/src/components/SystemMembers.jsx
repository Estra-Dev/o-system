import axios from "axios";
import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { IoTrashBinOutline } from "react-icons/io5";
import { FaCircleExclamation, FaRegTrashCan } from "react-icons/fa6";

const SystemMembers = () => {
  const params = useParams();
  const [systemDetails, setSystemDetails] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const membersCount = [];
  const [fetchedMembers, setFetchedMembers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [userIdToRemove, setUserIdToRemove] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [removeError, setRemoveError] = useState(null);

  const getSystem = async () => {
    try {
      const res = await axios.get(`/api/system/getsystem/${params.slug}`);
      // console.log("wetin", res);
      if (res.status === 200) {
        setSystemDetails(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async () => {
    try {
      const res = await axios.get(`/api/user/getusers`);
      if (res.status === 200) {
        setFetchedMembers(res.data.users);
        // console.log("All users poem", res.data);
        if (membersCount.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (fetchedMembers) {
    fetchedMembers.map((member) => {
      if (systemDetails.members.includes(member._id)) {
        membersCount.push(member);
      }
    });
  }

  const handleShowMore = async () => {
    const startIndex = membersCount.length;
    try {
      const res = await axios.get(
        `/api/user/getusers?startIndex=${startIndex}`
      );
      if (res.status === 200) {
        setFetchedMembers((prev) => [...prev, ...res.data.users]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveMember = async () => {
    try {
      const res = await axios.put(
        `/api/system/removemember/${systemDetails._id}/${currentUser._id}`,
        { userIdToRemove }
      );

      if (res.status === 200) {
        // setFetchedMembers((prev) => {
        //   prev.filter((member) => member._id !== userIdToDelete);
        // });
        membersCount.filter((member) => member._id !== userIdToRemove);
        setOpenModal(false);
        getUsers();
      }
    } catch (error) {
      setOpenModal(false);
      console.log(error.response.data.message);
    }
    console.log("Removed");
  };

  // console.log("first fetch", membersCount);

  useEffect(() => {
    getUsers();
    getSystem();
  }, []);

  return (
    <div className=" table-auto overflow-x-scroll md:mx-auto p-3">
      {membersCount.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Joined</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Remove </Table.HeadCell>
            </Table.Head>
            {membersCount.map((member) => (
              <Table.Body className=" divide-y" key={member._id}>
                <Table.Row className=" bg-white">
                  <Table.Cell>
                    {new Date(member.createdAt).toLocaleDateString()}
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
                </Table.Row>
              </Table.Body>
            ))}
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
        <h1>No member yet</h1>
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
