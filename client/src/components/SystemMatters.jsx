import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getSystemSuccess,
  getSystemFailure,
} from "../redux/system/systemSlice";
import { Alert, Button, FileInput, Modal } from "flowbite-react";
import { PiStarLight } from "react-icons/pi";
import { IoMdImages } from "react-icons/io";
import Matters from "./Matters";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const SystemMatters = () => {
  const [openPost, setOpenPost] = useState(false);
  const filePicker = useRef();
  const [chooseImage, setChooseImage] = useState("Upload Image");
  const [imageFile, setImageFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [publishError, setPublishError] = useState(null);

  // const [matters, setMatters] = useState(null);
  const params = useParams();
  // console.log(params.slug);
  const dispatch = useDispatch();
  const { systemDetails } = useSelector((state) => state.system);
  const { currentUser } = useSelector((state) => state.user);
  // const navigate = useNavigate();
  // const { currentUser } = useSelector((state) => state.user);

  const handleLogoChange = (ev) => {
    const file = ev.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUploadError(null);
      setChooseImage(file.name);
    }
  };

  console.log(imageFile);

  const handleUploadImage = async () => {
    try {
      if (!imageFile) {
        setImageUploadError("Please Select an Image for Your LOGO");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadProgress(null);
          setImageUploadError("Encountered an error trying to upload Image");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadUrl });
            setImageFileUrl(downloadUrl);
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload Error");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const getSystem = async () => {
    try {
      const res = await axios.get(`/api/system/getsystem/${params.slug}`);
      console.log(res);
      if (res.status === 200) {
        // setSystemDetails(res.data);
        dispatch(getSystemSuccess(res.data));
        // navigate(`/system/${res.data.slug}?tab=matters`);
      }
    } catch (error) {
      dispatch(getSystemFailure(error));
      console.log(error);
    }
  };

  console.log("System:", systemDetails);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setPublishError(null);
    try {
      const res = await axios.post(
        `/api/matter/creatematter/${systemDetails._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = res.data;
      if (res.status === 201) {
        console.log(data);
        setFormData(null);
        setOpenPost(false);
        getSystem();
        // if (matters) {
        //   addMattersToMattersArr();
        // }
        // navigate(`/system/${systemDetails.slug}?tab=matters`);
      }
    } catch (error) {
      console.log(error);
      setFormData(null);
      setPublishError(error.response.data.message);
    }
  };

  useEffect(() => {
    getSystem();
    // getMatters();
  }, []);

  // if (systemDetails) {
  //   console.log("admin:", systemDetails.admin, currentUser);
  //   if (systemDetails.admin.includes(currentUser._id)) {
  //     console.log("You are an Admin");
  //   } else {
  //     console.log("not an admin");
  //   }
  // }
  console.log("sysId", systemDetails._id);

  return (
    <div className=" flex md:justify-center gap-5 p-1 bg-gray-50 w-[85%] md:w-[1000px]">
      <div className=" w-full flex flex-col gap-1">
        <div className=" flex justify-between items-center head-system py-3 pr-2 bg-white rounded-md shadow-md w-full">
          <div className=" pl-[2%]">
            <h1 className=" font-semibold text-3xl flex items-center gap-2 text-gray-700 truncate">
              {systemDetails.name}{" "}
              <span>
                <PiStarLight className=" w-5 h-5 text-yellow-300" />
              </span>
            </h1>
          </div>
          {systemDetails && (
            <div>
              {systemDetails.admin.includes(currentUser._id) ||
              systemDetails.followers.includes(currentUser._id) ? (
                <Button outline size={"xs"}>
                  Following
                </Button>
              ) : (
                <Button size={"xs"} gradientDuoTone={"purpleToBlue"}>
                  Follow
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="all-matters flex flex-col w-full">
          <p className=" text-sm font-semibold italic my-4 px-2">
            {systemDetails.description}
          </p>
          <div className="publish w-full text-xs md:text-sm font-semibold p-3 bg-white">
            {systemDetails.members.includes(currentUser._id) ? (
              <Button
                disabled={openPost}
                onClick={() => setOpenPost(true)}
                outline
                gradientDuoTone={"purpleToBlue"}
              >
                Speak your mind, but mind what you Speak...
              </Button>
            ) : (
              <p className=" italic text-xs font-semibold py-5">
                You are not allowed to speak here, become a member...
              </p>
            )}
            {/* <TextInput  /> */}
          </div>
          <div className=" w-full">
            <Matters />
          </div>
          {/* <Matter />
          <Matter /> */}
        </div>
      </div>
      {/* <div className=" hidden md:block w-[35%] pl-4">
        <p>present</p>
      </div> */}
      {/* {systemDetails.members.includes(currentUser._id)
        ? "Member"
        : "Non Member"} */}
      <Modal
        popup
        size={"sm"}
        onClose={() => setOpenPost(false)}
        show={openPost}
      >
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="">
              {chooseImage == "Upload Image" ? (
                <div
                  title={chooseImage}
                  className=" font-bold text-sm text-orange-500 rounded-lg p-2 cursor-pointer truncate"
                  onClick={() => filePicker.current.click()}
                >
                  <IoMdImages className=" w-10 h-10" />
                  <span>Choose an Image</span>
                </div>
              ) : (
                <div className=" flex justify-between items-center gap-3">
                  <span className=" truncate">You Chose {chooseImage}</span>
                  <Button
                    type="button"
                    onClick={handleUploadImage}
                    size={"sm"}
                    disabled={imageUploadProgress}
                    outline
                    gradientDuoTone={"purpleToBlue"}
                  >
                    Upload
                  </Button>
                </div>
              )}
              <FileInput
                className=" hidden"
                type="file"
                accept="image/*"
                ref={filePicker}
                onChange={handleLogoChange}
              />
              {imageFileUrl && (
                <div className=" overflow-hidden rounded-md w-full my-3">
                  <img
                    src={imageFileUrl}
                    alt={imageFileUrl}
                    className=" rounded-md w-full object-cover"
                  />
                  <p
                    onClick={() => filePicker.current.click()}
                    className=" font-bold text-sm text-orange-500 rounded-lg p-2 cursor-pointer border mt-2"
                  >
                    Choose another Image
                  </p>
                </div>
              )}
            </div>
            <div>
              <ReactQuill
                theme="snow"
                placeholder="Say something courageeously and rightly..."
                className=" h-72 mb-20"
                required
                onChange={(value) => {
                  setFormData({ ...formData, content: value });
                }}
              />
            </div>
            {imageUploadError && (
              <Alert color={"failure"}>{imageUploadError}</Alert>
            )}
            <div className=" w-full">
              <Button
                type="submit"
                gradientDuoTone={"purpleToBlue"}
                className=" w-full"
              >
                Publish
              </Button>
            </div>
            {publishError && (
              <Alert color={"failure"} className=" mt-2">
                {publishError}
              </Alert>
            )}
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SystemMatters;
