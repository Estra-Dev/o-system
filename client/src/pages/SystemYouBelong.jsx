import axios from "axios";
import { TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SystemYouBelong = () => {
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

  useEffect(() => {
    system();
  }, []);
  return (
    <div className=" max-w-4xl w-full mx-auto my-5 min-h-screen flex flex-col items-center">
      <TextInput placeholder="Search..." />
      <div className="">
        <h1>Choose a system to drop matter.</h1>
      </div>
      <div className=" mt-5 flex flex-col gap-2 px-5 max-w-3xl w-full">
        {systems &&
          systems.map(
            (system) =>
              (system.members.includes(currentUser._id) ||
                system.ownedBy === currentUser._id) && (
                <Link
                  key={system._id}
                  to={`/system/${system.slug}?tab=matters`}
                >
                  <div className=" flex items-center rounded-md gap-3 shadow-sm">
                    <img
                      src={system.logo}
                      className=" w-10 h-10 object-cover rounded-full"
                      alt=""
                    />
                    {system.name}
                  </div>
                </Link>
              )
          )}
      </div>
    </div>
  );
};

export default SystemYouBelong;
