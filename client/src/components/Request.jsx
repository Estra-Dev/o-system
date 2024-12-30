import axios from "axios";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateError,
} from "../redux/system/systemSlice";

const Request = () => {
  const dispatch = useDispatch();
  const { systemDetails } = useSelector((state) => state.system);
  const [requested, setRequested] = useState(null);
  const [btn, setBtn] = useState(false);

  const getRequest = async () => {
    try {
      const res = await axios.get(`/api/user/getusers`);
      console.log("whoo", res.data);
      if (res.status === 200) {
        setRequested(res.data.users);
        // setRequested((prev) =>
        //   prev.filter((req) => systemDetails.joinRequest.includes(req._id))
        // );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRequest();
  }, []);

  console.log("req", requested);

  const admit = async (userId) => {
    dispatch(updateStart());
    setBtn(true);
    try {
      const res = await axios.put(
        `/api/system/admit/${systemDetails._id}/${userId}`
      );
      if (res.status === 200) {
        console.log("admit", res.data);
        setBtn(false);
        setRequested((prev) => prev.filter((req) => req._id !== userId));
        dispatch(updateSuccess(res.data));
      }
    } catch (error) {
      setBtn(false);
      dispatch(updateError(error.response.data.message));
      console.log(error);
    }
  };

  return (
    <div className=" w-full max-w-3xl mx-auto">
      <h1 className=" mt-4 p-3 border-b text-gray-800 font-semibold text-3xl">
        Add as member
      </h1>
      <div className=" p-3 flex flex-col gap-3 items-start w-full mt-6">
        {requested && requested.length > 0
          ? requested.map(
              (user) =>
                systemDetails.joinRequest.includes(user._id) && (
                  <div
                    key={user._id}
                    className=" flex items-center w-full gap-4"
                  >
                    <img
                      src={user.profilePicture}
                      alt="user"
                      className=" w-10 h-10 object-cover rounded-full"
                    />
                    <div className=" flex flex-col mb-2 flex-1">
                      <h2 className=" text-gray-700">
                        {user.firstname + " " + user.lastname}
                      </h2>
                    </div>
                    {systemDetails.joinRequest.includes(user._id) && (
                      <Button
                        type="button"
                        gradientDuoTone={"purpleToBlue"}
                        size={"xs"}
                        onClick={() => {
                          admit(user._id);
                        }}
                        disabled={btn}
                      >
                        Admit
                      </Button>
                    )}
                  </div>
                )
            )
          : "No Request"}
      </div>

      {/* <Modal popup size={"sm"} onClose={() => setModal(false)} show={modal}>
        <Modal.Header />
        <Modal.Body>
          <div className=" text-center">
            <FaCircleExclamation className=" w-10 h-10 mx-auto mb-4 text-red-500" />
            <h3 className=" text-lg mb-4 text-gray-500">
              Please make sure you know this person
            </h3>
            <div className=" flex justify-center gap-4">
              <Button outline color={"success"} onClick={handleAdd}>
                <p>Yes, Continue</p>
              </Button>
              <Button outline onClick={() => setModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}
    </div>
  );
};

export default Request;
