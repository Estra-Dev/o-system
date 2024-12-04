import { Sidebar } from "flowbite-react";
import { FaRegUserCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { PiNewspaperBold } from "react-icons/pi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { ImAlarm } from "react-icons/im";
import { GoDotFill } from "react-icons/go";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPeoplePulling } from "react-icons/fa6";
import {
  getSystemSuccess,
  getSystemFailure,
} from "../redux/system/systemSlice";

const SystemSidebar = () => {
  const params = useParams();
  // console.log(params.slug);
  const dispatch = useDispatch();
  const [systemDetail, setSystemDetail] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { systemDetails } = useSelector((state) => state.system);
  const membersCount = [];
  const [fetchedMembers, setFetchedMembers] = useState(null);

  const getSystem = async () => {
    try {
      const res = await axios.get(`/api/system/getsystem/${params.slug}`);
      console.log(res);
      if (res.status === 200) {
        setSystemDetail(res.data);
        dispatch(getSystemSuccess(res.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("fetchde", fetchedMembers);
  const getUsers = async () => {
    try {
      const res = await axios.get(`/api/user/getusers`);
      if (res.status === 200) {
        setFetchedMembers(res.data.users);
        console.log("All users", res.data);
        // res.data.users.map((user) => {
        //   if (systemDetails && systemDetails.members.includes(user._id)) {
        //     console.log("passed test", user);
        //     setFetchedMembers(fetchedMembers + 1);
        //     membersCount.push(user);
        //   }
        //   console.log("Valid", membersCount.length);
        // });
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
  console.log("Valid", membersCount.length);
  console.log("System:", systemDetails);

  useEffect(() => {
    getSystem();
    getUsers();
  }, [params.slug]);
  if (systemDetails) {
    if (systemDetails.admin.includes(currentUser._id)) {
      console.log("You are an Admin");
    } else {
      console.log("not an admin");
    }
  }
  return (
    <Sidebar className=" w-full md:w-[100px] sticky">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item>
            {systemDetails && systemDetail && (
              <div className=" w-12 h-12 mb-7 mt-5 rounded-full overflow-hidden">
                <img
                  src={systemDetails.logo || systemDetail.logo}
                  alt="Logo"
                  className=" rounded-full w-full h-full object-cover"
                />
              </div>
            )}
          </Sidebar.Item>
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item as="div">
              <div className=" flex flex-col justify-center items-center text-xs font-semibold">
                <FaRegUserCircle className=" w-7 h-7 mb-1" />
                <span>
                  {systemDetails &&
                  systemDetails.admin.includes(currentUser._id)
                    ? "Admin"
                    : "Member"}
                </span>
              </div>
            </Sidebar.Item>
          </Link>
          {systemDetail && (
            <Link to={`/system/${systemDetail.slug}?tab=matters`}>
              <Sidebar.Item as="div">
                <div className=" flex flex-col justify-center items-center text-xs font-semibold">
                  <PiNewspaperBold className=" w-7 h-7 mb-1" />
                  <span>Matters</span>
                </div>
              </Sidebar.Item>
            </Link>
          )}
          {systemDetails && (
            <Link to={`/system/${systemDetails.slug}?tab=members`}>
              <Sidebar.Item as="div">
                <div className=" flex flex-col justify-center items-center text-xs font-semibold">
                  <span>{membersCount.length}</span>
                  <HiOutlineUserGroup className=" w-7 h-7 mb-1" />
                </div>
              </Sidebar.Item>
            </Link>
          )}
          {systemDetails && systemDetails.admin.includes(currentUser._id) && (
            <Link to={`/system/${systemDetails.slug}?tab=add-people`}>
              <Sidebar.Item as="div">
                <div className=" flex flex-col justify-center items-center text-xs font-semibold">
                  <FaPeoplePulling className=" w-7 h-7 mb-1" />
                  Add
                </div>
              </Sidebar.Item>
            </Link>
          )}
          {systemDetails &&
            systemDetails.admin.includes(currentUser._id) &&
            systemDetails.joinRequest.length > 0 && (
              <Link to={`/system/${systemDetails.slug}?tab=join-request`}>
                <Sidebar.Item as="div">
                  <div className=" flex flex-col justify-center items-center text-xs font-semibold relative">
                    <p className=" absolute bottom-9 font-bold text-lg text-red-600">
                      <GoDotFill color="red" />
                    </p>
                    <ImAlarm className=" w-7 h-7 mb-1" />
                    Request
                  </div>
                </Sidebar.Item>
              </Link>
            )}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SystemSidebar;
