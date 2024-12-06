import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { LuSearchCode } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";

const JoinSystem = () => {
  const [systems, setSystems] = useState([]);
  const [btn, setBtn] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const { systemDetails } = useSelector((state) => state.system);

  console.log("first", search);

  const system = async () => {
    try {
      const res = await axios.get(`/api/system/getsystem`);
      console.log("all systems:", res.data);
      if (res.status === 200) {
        setSystems(res.data.system);
        if (systems.length < 4) {
          setShowMore(false);
        } else {
          setShowMore(true);
        }
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

  const handleSearch = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", search);
    const searchQuery = urlParams.toString();
    navigate(`/join-system?${searchQuery}`);

    try {
      const res = await axios.get(`/api/system/getsystem?searchTerm=${search}`);
      if (res.status === 200) {
        setLoading(false);
        setSystems(res.data.system);
        setSearch("");

        if (systems.length < 4) {
          setShowMore(false);
        } else {
          setShowMore(true);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleShowMore = async () => {
    const startIndex = systems.length;
    try {
      const res = await axios.get(
        `/api/system/getsystem?startIndex=${startIndex}`
      );
      if (res.status === 200) {
        setSystems((prev) => [...prev, ...res.data.system]);

        if (res.data.system.length < 4) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    if (systems.length < 1) {
      system();
    }

    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearch(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <div className=" max-w-4xl w-full mx-auto my-5 min-h-screen flex flex-col items-center">
      <div className=" max-w-2xl w-full px-6 py-4">
        <div className=" flex items-center gap-2 border bg-gray-100 max-w-xl w-full px-3 py-2 rounded-md">
          <form
            onSubmit={handleSearch}
            className=" flex items-center gap-3 w-full"
          >
            <input
              className=" outline-none w-full bg-transparent"
              placeholder="Search..."
              value={search}
              onChange={(ev) => setSearch(ev.target.value)}
            />
            <LuSearchCode
              onClick={handleSearch}
              className=" w-6 h-6 text-gray-500 cursor-pointer"
            />
          </form>
          {/* <Button type="button">O</Button> */}
        </div>
        {loading ? (
          <div className=" mt-3 flex items-center gap-2 justify-center max-w-xl w-full mx-auto">
            <Spinner size={"lg"} />
            <h2 className=" text-xl font-semibold text-blue-500 text-center">
              Looking for Systems
            </h2>
          </div>
        ) : systems.length > 0 ? (
          <div className=" mt-3">
            <h1 className=" text-2xl font-semibold text-blue-500 text-center">
              Join a Known System.
            </h1>
          </div>
        ) : (
          <div className="">
            <h1 className=" text-2xl font-semibold text-red-500 text-center">
              No available System.
            </h1>
          </div>
        )}
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
      {showMore && (
        <Button
          type="button"
          outline
          gradientDuoTone={"purpleToBlue"}
          onClick={handleShowMore}
        >
          Show more
        </Button>
      )}
    </div>
  );
};

export default JoinSystem;
