// import axios from "axios";
import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
// import {
//   getSystemSuccess,
//   getSystemFailure,
// } from "../redux/system/systemSlice";
import { Button } from "flowbite-react";
import { PiStarLight } from "react-icons/pi";
// import { IoMdImages } from "react-icons/io";
import Matters from "./Matters";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { app } from "../firebase";

const SystemMatters = () => {
  const { systemDetails } = useSelector((state) => state.system);
  const { currentUser } = useSelector((state) => state.user);
  const [openPost, setOpenPost] = useState(false);

  // const getSystem = async () => {
  //   try {
  //     const res = await axios.get(`/api/system/getsystem/${params.slug}`);
  //     console.log(res);
  //     if (res.status === 200) {
  //       // setSystemDetails(res.data);
  //       dispatch(getSystemSuccess(res.data));
  //       // navigate(`/system/${res.data.slug}?tab=matters`);
  //     }
  //   } catch (error) {
  //     dispatch(getSystemFailure(error));
  //     console.log(error);
  //   }
  // };

  // console.log("System:", systemDetails);

  useEffect(() => {
    // getSystem();
    // getMatters();
  }, []);

  // if (systemDetails) {
  //   console.log("admin:", systemDetails.admin, currentUser);
  //   if (systemDetails.admin.includes(currentUser._id)) {
  //     console.log("You are an Admin");
  //   } else {
  //     console.log("not an admin");
  //   }
  // }
  // console.log("sysId", systemDetails._id);

  return (
    <div className=" flex md:justify-center gap-5 p-1 bg-gray-50 w-[85%] md:w-[1000px]">
      <div className=" w-full flex flex-col gap-1">
        <div className=" flex justify-between items-center head-system py-3 pr-2 bg-white rounded-md shadow-md w-full">
          <div className=" pl-[2%]">
            <h1 className=" font-semibold text-3xl flex items-center gap-2 text-gray-700 truncate">
              {systemDetails && systemDetails.name}{" "}
              <span>
                <PiStarLight className=" w-5 h-5 text-yellow-300" />
              </span>
            </h1>
          </div>
          {systemDetails && (
            <div>
              {systemDetails.admin.includes(currentUser._id) ||
              systemDetails.followers.includes(currentUser._id) ? (
                <Button outline size={"xs"}>
                  Following
                </Button>
              ) : (
                <Button size={"xs"} gradientDuoTone={"purpleToBlue"}>
                  Follow
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="all-matters flex flex-col w-full">
          <p className=" text-sm font-semibold italic my-4 px-2">
            {systemDetails.description}
          </p>
          <div className="publish w-full text-xs md:text-sm font-semibold p-3 bg-white">
            {systemDetails.members.includes(currentUser._id) ||
            systemDetails.ownedBy === currentUser._id ? (
              <Button
                disabled={openPost}
                onClick={() => setOpenPost(true)}
                outline
                gradientDuoTone={"purpleToBlue"}
              >
                Speak your mind, but mind what you Speak...
              </Button>
            ) : (
              <p className=" italic text-xs font-semibold py-5">
                You are not allowed to speak here, become a member...
              </p>
            )}
            {/* <TextInput  /> */}
          </div>
          <div className=" w-full">
            <Matters setOpenPost={setOpenPost} openPost={openPost} />
          </div>
          {/* <Matter />
          <Matter /> */}
        </div>
      </div>
      {/* <div className=" hidden md:block w-[35%] pl-4">
        <p>present</p>
      </div> */}
      {/* {systemDetails.members.includes(currentUser._id)
        ? "Member"
        : "Non Member"} */}
    </div>
  );
};

export default SystemMatters;
