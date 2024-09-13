import axios from "axios";
import { Button, Modal, Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

const DashSidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const tabFromUrl = urlParam.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await axios.post("/api/user/signout/");
      if (res.status === 200) {
        setShowModal(false);
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className="w-full md:w-[100px]">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item active={tab === "profile"} as="div">
              <FaRegUserCircle />
            </Sidebar.Item>
          </Link>
          <Sidebar.Item>
            <Button
              color={"gray"}
              title="Sign Out"
              onClick={() => setShowModal(true)}
            >
              <MdLogout />
            </Button>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <p className=" text-2xl text-gray-700 text-center">
            Are You sure You want to Sign out?
          </p>
          <div className=" flex justify-center gap-4 mt-5">
            <Button color={"failure"} outline onClick={handleSignOut}>
              Yes, Sign Out
            </Button>
            <Button color={"gray"} onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Sidebar>
  );
};

export default DashSidebar;
