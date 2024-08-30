import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    console.log(tabFromUrl);
  }, [location.search]);

  return (
    <div className=" min-h-screen flex ">
      <div className=" w-[50px] md:w-[100px]">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* Profile... */}
      {tab === "profile" && <DashProfile />}
    </div>
  );
};

export default Dashboard;
