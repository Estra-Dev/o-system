import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SystemSidebar from "../components/SystemSidebar";
import SystemMatters from "../components/SystemMatters";
import SystemMembers from "../components/SystemMembers";
import SingleMatter from "../components/SingleMatter";
import AllUsers from "../components/AllUsers";

const System = () => {
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
    <div className=" min-h-screen flex relative max-w-5xl w-full">
      <div className=" w-[15%] md:w-[100px]">
        {/* Sidebar */}
        <SystemSidebar />
      </div>
      {tab === "matters" && <SystemMatters />}
      {tab === "members" && <SystemMembers />}
      {tab === "thismatter" && <SingleMatter />}
      {tab === "add-people" && <AllUsers />}
    </div>
  );
};

export default System;
