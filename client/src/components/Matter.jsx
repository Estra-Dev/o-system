import { Avatar, Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaRegTrashCan, FaCircleExclamation } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { Link } from "react-router-dom";

const Matter = () => {
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

  const handleDeleteMatter = async () => {
    console.log("idtdel", matterIdToDelete);

    try {
      const res = await axios.delete(
        `/api/matter/deletematter/${matterIdToDelete}/${systemDetails._id}/${currentUser._id}`
      );

      if (res.status === 200) {
        setSystemMatters((prev) => {
          prev.filter((matter) => matter._id !== matterIdToDelete);
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

  return (
    <div>
      {systemMatters && systemMatters.length > 0 ? (
        <>
          {systemMatters.map((matter) => (
            <div
              key={matter._id}
              className=" shadow-lg mb-3 p-5 rounded-md bg-white w-full"
            >
              <div className="first flex justify-start gap-2 whitespace-nowrap text-xs sm:text-sm w-full">
                <div className=" w-14 h-10 rounded-full overflow-hidden">
                  <Avatar alt="user" img={matter.userProfileImage} rounded />
                </div>
                <p className=" text-xs truncate text-orange-400">
                  {matter && matter.anon_name}
                </p>
                <p className=" text-xs truncate">
                  {matter && matter.system_name}
                </p>
                <p className=" text-xs truncate">
                  {matter && new Date(matter.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="second max-w-3xl w-full flex flex-col items-end">
                <div className=" w-[90%] rounded-md relative">
                  <p
                    className=" text-gray-900 font-semibold text-sm my-3"
                    dangerouslySetInnerHTML={{
                      __html: matter && matter.content,
                    }}
                  ></p>

                  {matter && matter.image && (
                    <img
                      src={matter && matter.image}
                      className={` w-full rounded-md my-2}`}
                      alt="post image"
                    />
                  )}
                  <div className="reactions flex justify-around items-center gap-3 py-2 mt-3 text-xs border-t-2">
                    <span>Confirm</span>
                    <span>Important</span>
                    <span>Comment</span>
                    {matter.userId === currentUser._id &&
                      systemDetails.admin.includes(currentUser._id) && (
                        <span
                          className=" cursor-pointer"
                          onClick={() => {
                            setMatterIdToDelete(matter._id);
                            setOpenModal(true);
                          }}
                        >
                          <FaRegTrashCan className=" text-red-600 text-lg" />
                        </span>
                      )}
                    {matter.userId === currentUser._id && (
                      <Link to={`/update-matter/${matter._id}`}>
                        <span className=" cursor-pointer">
                          <CiEdit className=" text-blue-600 text-lg font-semibold" />
                        </span>
                      </Link>
                    )}
                    {/* <span>Important</span> */}
                  </div>
                </div>
              </div>
            </div>
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
              <Button outline color={"failure"} onClick={handleDeleteMatter}>
                <FaRegTrashCan className=" text-red-500 text-lg" />
              </Button>
              <Button outline>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Matter;
