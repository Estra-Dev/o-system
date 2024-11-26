import { Avatar, Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaRegTrashCan, FaCircleExclamation } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import { CiEdit } from "react-icons/ci";
import { Link } from "react-router-dom";
import Matter from "./Matter";

const Matters = () => {
  const { systemDetails } = useSelector((state) => state.system);
  const { currentUser } = useSelector((state) => state.user);
  const [systemMatters, setSystemMatters] = useState([]);
  const [matterIdToDelete, setMatterIdToDelete] = useState("");
  const [openModal, setOpenModal] = useState(false);

  // const [userDetails, setUserDetails] = useState("");

  console.log("Post matters", systemMatters);
  const getMatters = async () => {
    try {
      const res = await axios.get(
        `/api/matter/getmatters?systemId=${systemDetails._id}`
      );
      if (res.status === 200) {
        setSystemMatters(res.data.matters);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMatter = async (matterId) => {
    // console.log("idtdel", matterIdToDelete);

    try {
      const res = await axios.delete(
        `/api/matter/deletematter/${matterId}/${systemDetails._id}/${currentUser._id}`
      );

      if (res.status === 200) {
        setSystemMatters((prev) => {
          prev.filter((matter) => matter._id !== matterId);
        });
        setOpenModal(false);
        getMatters();
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    getMatters();
  }, [systemDetails._id]);

  const handleConfirm = async (matterId) => {
    try {
      const res = await axios.put(`/api/matter/likematter/${matterId}`);
      if (res.status === 200) {
        setSystemMatters(
          systemMatters.map((matter) =>
            matter._id === matterId
              ? {
                  ...matter,
                  likes: res.data.likes,
                  numberOfLikes: res.data.length,
                }
              : matter
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {systemMatters && systemMatters.length > 0 ? (
        <>
          {systemMatters.map((matter) => (
            <Matter
              key={matter._id}
              matter={matter}
              onConfirm={handleConfirm}
              onDelete={(matterId) => {
                setOpenModal(true);
                setMatterIdToDelete(matterId);
              }}
            />
          ))}
        </>
      ) : (
        <p>There are no Matters yet</p>
      )}
      <Modal
        popup
        size={"sm"}
        onClose={() => setOpenModal(false)}
        show={openModal}
      >
        <Modal.Header />
        <Modal.Body>
          <div className=" text-center">
            <FaCircleExclamation className=" w-10 h-10 mx-auto mb-4 text-red-500" />
            <h3 className=" text-lg mb-4 text-gray-500">
              Are You sure you want to delete this matter?
            </h3>
            <div className=" flex justify-center gap-4">
              <Button
                outline
                color={"failure"}
                onClick={() => handleDeleteMatter(matterIdToDelete)}
              >
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

export default Matters;
