import { Sidebar } from "flowbite-react";
import { FaRegUserCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { PiNewspaperBold } from "react-icons/pi";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SystemSidebar = () => {
  const params = useParams();
  // console.log(params.slug);
  const [systemDetails, setSystemDetails] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const getSystem = async () => {
    try {
      const res = await axios.get(`/api/system/getsystem/${params.slug}`);
      console.log(res);
      if (res.status === 200) {
        setSystemDetails(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("System:", systemDetails);

  useEffect(() => {
    getSystem();
  }, []);
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
            {systemDetails && (
              <div className=" w-12 h-12 mb-7 mt-5 rounded-full overflow-hidden">
                <img
                  src={systemDetails.logo}
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
          {systemDetails && (
            <Link to={`/system/${systemDetails.slug}?tab=matters`}>
              <Sidebar.Item as="div">
                <div className=" flex flex-col justify-center items-center text-xs font-semibold">
                  <PiNewspaperBold className=" w-7 h-7 mb-1" />
                  <span>Matters</span>
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
