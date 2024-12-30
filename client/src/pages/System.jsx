import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SystemSidebar from "../components/SystemSidebar";
import SystemMatters from "../components/SystemMatters";
import SystemMembers from "../components/SystemMembers";
import SingleMatter from "../components/SingleMatter";
import AllUsers from "../components/AllUsers";
import Request from "../components/Request";

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
    <div className=" min-h-screen flex relative w-full ">
      <div className=" w-[15%] md:w-[100px]">
        {/* Sidebar */}
        <SystemSidebar />
      </div>
      <div className=" w-[85%] md:w-[100%]">
        {tab === "matters" && <SystemMatters />}
        {tab === "members" && <SystemMembers />}
        {tab === "thismatter" && <SingleMatter />}
        {tab === "add-people" && <AllUsers />}
        {tab === "join-request" && <Request />}
      </div>
    </div>
  );
};

export default System;
