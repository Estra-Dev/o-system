import axios from "axios";
import { Button, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  updateStart,
  updateSuccess,
  updateError,
} from "../redux/system/systemSlice";

const JoinSystem = () => {
  const [systems, setSystems] = useState([]);
  const [btn, setBtn] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const { systemDetails } = useSelector((state) => state.system);
  const dispatch = useDispatch();

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

  const joinSystem = async (systemId) => {
    // dispatch(updateStart());
    setBtn(true);
    try {
      const res = await axios.put(
        `/api/system/joinsystem/${systemId}/${currentUser._id}`
      );
      if (res.status === 200) {
        // dispatch(updateSuccess(res.data));
        setSystems((prev) => prev.filter((system) => system._id !== systemId));
        console.log("Joined", res.data);
        setBtn(false);
      }
    } catch (error) {
      // dispatch(updateError(error.response.data.message));
      console.log(error);
    }
  };

  useEffect(() => {
    system();
  }, []);

  return (
    <div className=" max-w-4xl w-full mx-auto my-5 min-h-screen flex flex-col items-center">
      <div className=" max-w-2xl w-full px-6 py-4">
        <TextInput placeholder="Search..." className=" w-full my-3" />
        <h1 className=" text-2xl font-semibold text-blue-500 text-center">
          Join a Known System.
        </h1>
      </div>
      <div className=" mt-5 flex flex-col gap-2 px-5 max-w-3xl w-full">
        {systems &&
          systems.map(
            (system) =>
              systemDetails &&
              !system.joinRequest.includes(currentUser._id) &&
              !system.members.includes(currentUser._id) &&
              system.ownedBy !== currentUser._id && (
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
                  {system.joinRequest.includes(currentUser._id) ? (
                    <Button
                      size={"xs"}
                      color={"gray"}
                      onClick={() => joinSystem(system._id)}
                      disabled={btn}
                    >
                      Cancel Request
                    </Button>
                  ) : (
                    <Button
                      size={"xs"}
                      gradientDuoTone={"purpleToBlue"}
                      outline
                      onClick={() => joinSystem(system._id)}
                      disabled={btn}
                    >
                      Send Request
                    </Button>
                  )}
                  {/* { && (
                
              )} */}
                </span>
              )
          )}
      </div>
    </div>
  );
};

export default JoinSystem;
