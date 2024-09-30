import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getSystemSuccess,
  getSystemFailure,
} from "../redux/system/systemSlice";
import { Button } from "flowbite-react";
import { PiStarLight } from "react-icons/pi";
import Post from "./Post";
// import { useSelector } from "react-redux";

const SystemMatters = () => {
  const params = useParams();
  // console.log(params.slug);
  // const [systemDetails, setSystemDetails] = useState(null);
  const dispatch = useDispatch();
  const { systemDetails } = useSelector((state) => state.system);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  // const { currentUser } = useSelector((state) => state.user);

  const getSystem = async () => {
    try {
      const res = await axios.get(`/api/system/getsystem/${params.slug}`);
      console.log(res);
      if (res.status === 200) {
        // setSystemDetails(res.data);
        dispatch(getSystemSuccess(res.data));
        // navigate(`/system/${res.data.slug}?tab=matters`);
      }
    } catch (error) {
      dispatch(getSystemFailure(error));
      console.log(error);
    }
  };

  console.log("System:", systemDetails);

  useEffect(() => {
    getSystem();
  }, []);

  // if (systemDetails) {
  //   console.log("admin:", systemDetails.admin, currentUser);
  //   if (systemDetails.admin.includes(currentUser._id)) {
  //     console.log("You are an Admin");
  //   } else {
  //     console.log("not an admin");
  //   }
  // }

  return (
    <div className=" flex md:justify-center gap-5 p-1 bg-gray-50 w-full">
      <div className=" w-full flex-1 flex flex-col gap-1">
        <div className=" flex justify-between items-center head-system py-3 pr-2 bg-white rounded-md shadow-md">
          <div className=" pl-[5%]">
            <h1 className=" font-semibold text-3xl flex items-center gap-2 text-gray-700 truncate">
              {systemDetails.name}{" "}
              <span>
                <PiStarLight className=" w-5 h-5 text-yellow-300" />
              </span>
            </h1>
            <p className=" text-xs font-semibold italic shadow-md">
              {systemDetails.description}
            </p>
          </div>
          {systemDetails && (
            <>
              {systemDetails.admin.includes(currentUser._id) ||
              systemDetails.followers.includes(currentUser._id) ? (
                <Button outline>Following</Button>
              ) : (
                <Button size={"sm"}>Follow</Button>
              )}
            </>
          )}
        </div>
        <div className="all-matters">
          <Post />
          <Post />
          <Post />
        </div>
      </div>
      <div className=" hidden md:block w-[35%] pl-4">
        <p>present</p>
      </div>
      {/* {systemDetails.members.includes(currentUser._id)
        ? "Member"
        : "Non Member"} */}
    </div>
  );
};

export default SystemMatters;
