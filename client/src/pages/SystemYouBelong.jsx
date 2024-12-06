import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuSearchCode } from "react-icons/lu";

const SystemYouBelong = () => {
  const [systems, setSystems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  console.log("search", search);

  const system = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/system/getsystem`);
      console.log("all systems:", res.data);
      if (res.status === 200) {
        setSystems(res.data.system);
        setLoading(false);

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

  const searchSystem = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", search);
    const searchQuery = urlParams.toString();
    navigate(`/drop-matter?${searchQuery}`);
    try {
      const res = await axios.get(`/api/system/getsystem?searchTerm=${search}`);
      if (res.status === 200) {
        setLoading(false);
        setSystems(res.data.system);
        setSearch("");

        if (res.data.system.length < 4) {
          setShowMore(false);
        } else {
          setShowMore(true);
        }
      }
      console.log("filter", systems);
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
        setSystems([...systems, ...res.data.system]);
        if (res.data.system.length <= 4) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("more", systems);

  useEffect(() => {
    if (systems.length < 1) {
      system();
    }
    // searchSystem();
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearch(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <div className=" max-w-4xl w-full mx-auto my-5 min-h-screen flex flex-col items-center px-4">
      <div className=" flex items-center gap-2 border bg-gray-100 max-w-xl w-full px-3 py-2 rounded-md">
        <form
          onSubmit={searchSystem}
          className=" flex items-center gap-3 w-full"
        >
          <input
            className=" outline-none w-full bg-transparent"
            placeholder="Search..."
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
          />
          <LuSearchCode
            onClick={searchSystem}
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
            Choose a system to drop matter.
          </h1>
        </div>
      ) : (
        <div className="">
          <h1 className=" text-2xl font-semibold text-red-500 text-center">
            No System found.
          </h1>
        </div>
      )}
      <div className=" mt-5 flex flex-col gap-2 px-3 max-w-3xl w-full">
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

export default SystemYouBelong;
