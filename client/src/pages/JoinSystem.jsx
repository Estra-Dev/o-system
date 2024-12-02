import axios from "axios";
import { Button, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

const JoinSystem = () => {
  const [systems, setSystems] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  const system = async () => {
    try {
      const res = await axios.get(`/api/system/getsystems`);
      console.log("all systems:", res.data);
      if (res.status === 200) {
        setSystems(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // if (systems.length > 0) {
  //   const rand = systems[Math.floor(Math.random() * systems.length)];
  //   console.log("rand", rand);
  // }

  useEffect(() => {
    system();
  }, []);

  return (
    <div className=" max-w-4xl w-full mx-auto my-5 min-h-screen flex flex-col items-center">
      <TextInput placeholder="Search..." />
      <div className="">
        <h1>Join a Known System.</h1>
      </div>
      <div className=" mt-5 flex flex-col gap-2 px-5 max-w-3xl w-full">
        {systems &&
          systems.map((system) => (
            <span
              key={system._id}
              className=" flex items-center gap-3 shadow-sm border-b px-3 rounded-md"
            >
              <img
                src={system.logo}
                className=" w-10 h-10 object-cover rounded-full shadow-md"
                alt="logo"
              />
              <div className=" flex-1">
                <h2 className=" font-semibold text-sm">{system.name}</h2>
                <p className=" text-xs italic text-gray-600">
                  {system.description}
                </p>
                <pre className=" text-[9px]">
                  {moment(system.createdAt).fromNow()}
                </pre>
              </div>
              <Button size={"xs"} outline gradientDuoTone={"purpleToBlue"}>
                Send Request
              </Button>
            </span>
          ))}
      </div>
    </div>
  );
};

export default JoinSystem;
