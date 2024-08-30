import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const tabFromUrl = urlParam.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <Sidebar className="w-full md:w-[100px]">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item active={tab === "profile"} as="div">
              <FaRegUserCircle />
            </Sidebar.Item>
          </Link>
          <Sidebar.Item className="cursor-pointer">
            <MdLogout />
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
