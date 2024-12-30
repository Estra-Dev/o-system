import { Button } from "flowbite-react";
// import Matter from "../components/Matter";
import { Link } from "react-router-dom";
import Updates from "../components/Updates";
import JoinSystem from "./JoinSystem";
import SystemYouBelong from "./SystemYouBelong";

const Home = () => {
  return (
    <div className=" min-h-screen mt-5">
      <div className=" w-full max-w-3xl lg:max-w-[1500px] mx-auto flex flex-col md:flex-row gap-4 justify-center">
        <div className=" max-w-[25%] w-full hidden p-5 md:block">
          <h2 className=" text-center font-semibold text-2xl text-gray-700">
            Systems You may like to Join
          </h2>
          <JoinSystem />
        </div>

        <div className=" flex-1 border border-t-0">
          <div className=" flex flex-wrap justify-center gap-4">
            <Link to={"/create-system"}>
              <button className=" bg-orange-500 text-[11px] text-white rounded-md px-2 py-3 font-extrabold">
                Create a System
              </button>
            </Link>
            <Link to={"/drop-matter"}>
              <button className=" bg-cyan-500 font-extrabold text-[11px] text-white px-2 py-3 rounded-md">
                Drop a Matter
              </button>
            </Link>
            <Link to={"/join-system"}>
              <button className=" font-extrabold text-[11px] text-white rounded-md px-2 py-3 bg-yellow-300">
                Join a System
              </button>
            </Link>
          </div>
          <div className="  mt-5 rounded-md border-t-2">
            <h1 className=" text-3xl font-bold text-gray-700 mt-7 mb-4 pl-9">
              Updates
            </h1>
            {/* <Matter />
            <Matter />
            <Matter /> */}
            <Updates />
          </div>
        </div>

        <div className="w-full max-w-[25%] hidden lg:block p-5">
          <h2 className=" text-center font-semibold text-2xl text-gray-700">
            Systems You Belong
          </h2>
          <SystemYouBelong />
        </div>
      </div>
    </div>
  );
};

export default Home;
