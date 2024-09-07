import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { FaPen, FaTimes } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../redux/user/userSlice";
import axios from "axios";

const DashProfile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUpploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUpploadingError, setImageFileUploadingError] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [completedUpdate, setCompletedUpdate] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  const filePicker = useRef();

  const handleImageChange = (ev) => {
    const file = ev.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  // console.log(imageFile, imageFileUrl);

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  // console.log(imageFileUpploadingProgress, imageFileUpploadingError);
  const uploadImage = async () => {
    setImageFileUploadingError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadingError(
          "Could not upload image file, (make sure file is less than 12mb)"
        );
        setImageFileUploadingProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl });
        });
      }
    );
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData({ ...formData, [name]: value });
  };
  console.log(formData);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes  made");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await axios.put(
        `/api/user/update/${currentUser._id}`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200) {
        dispatch(updateSuccess(res.data));
        setShowForm(false);
        setImageFileUploadingProgress(null);
        setCompletedUpdate("Your Profile has be updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.response.data.message));
    }
  };

  return (
    <div className=" w-full flex flex-col md:flex-row relative">
      <form
        className={` p-4 pb-8 rounded-r-md shadow-md lg:w-[25%] relative `}
        onSubmit={handleSubmit}
      >
        <div
          className={` relative w-32 h-32 md:w-52 md:h-52 self-center cursor-pointer shadow-md rounded-full`}
          onClick={() => filePicker.current.click()}
        >
          {imageFileUpploadingProgress && (
            <CircularProgressbar
              value={imageFileUpploadingProgress || 0}
              text={`${imageFileUpploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  top: "0",
                  left: "0",
                },
                path: {
                  stroke: `rgba(62, 52, 199, ${
                    imageFileUpploadingProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={` rounded-full object-cover border-4 border-[lightgray] w-full h-full ${
              imageFileUpploadingProgress &&
              imageFileUpploadingProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUpploadingProgress == 100 && (
          <Button
            className=" mt-3"
            type="submit"
            gradientDuoTone={"purpleToBlue"}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner /> Uploading...
              </>
            ) : (
              "Update Image"
            )}
          </Button>
        )}
        {completedUpdate && (
          <Alert color={"success"} className=" mt-3">
            {completedUpdate}
          </Alert>
        )}
        {imageFileUpploadingError && (
          <Alert color={"failure"}>{imageFileUpploadingError}</Alert>
        )}
        <div>
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePicker}
          />
        </div>
        <div className=" flex gap-1 justify-between items-center pt-2">
          <p className=" font-semibold text-2xl">
            {currentUser.firstname + " " + currentUser.lastname}
          </p>
        </div>

        <div className=" flex gap-1 justify-between items-center pt-2">
          <p className=" font-semibold text-gray-600 text-xs">
            {currentUser.email}
          </p>
        </div>

        <Button
          className=" mt-4"
          outline
          gradientDuoTone={"purpleToBlue"}
          onClick={() => setShowForm(true)}
          disabled={
            showForm ||
            (imageFileUpploadingProgress && imageFileUpploadingProgress < 100)
          }
        >
          Edit Profile
          <FaPen className=" ml-3 w-4 h-4 text-xs cursor-pointer" />
        </Button>
        <div className=" text-red-600 mt-5">Burn Account</div>
      </form>
      <div
        className={`${
          showForm
            ? "visible absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] max-w-lg p-5 rounded-md shadow-lg w-full z-50 bg-white border"
            : "hidden"
        }`}
      >
        <p></p>
        <form className=" relative flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className=" w-full flex justify-end">
            <button
              className=" outline-none"
              onClick={() => setShowForm(false)}
              type="button"
            >
              <FaTimes className=" text-red-600" />
            </button>
          </div>
          <p className=" text-3xl font-semibold text-center pb-4">
            Update Your Profile
          </p>
          <div className="">
            <Label htmlFor="firstname">First Name</Label>
            <TextInput
              type="text"
              placeholder="Your First Name"
              name="firstname"
              defaultValue={currentUser.firstname}
              onChange={handleChange}
            />
          </div>
          <div className="">
            <Label htmlFor="lastname">Last Name</Label>
            <TextInput
              type="text"
              placeholder="Your Last Name"
              name="lastname"
              defaultValue={currentUser.lastname}
              onChange={handleChange}
            />
          </div>
          <div className="">
            <Label htmlFor="email">Email</Label>
            <TextInput
              type="email"
              placeholder="name@company.com"
              name="email"
              defaultValue={currentUser.email}
              onChange={handleChange}
            />
          </div>
          <div className="">
            <Label htmlFor="password">Password</Label>
            <TextInput
              type="password"
              placeholder="password"
              name="password"
              onChange={handleChange}
            />
          </div>
          {error && <Alert color={"failure"}>{error}</Alert>}
          {updateUserError && (
            <Alert color={"failure"}>{updateUserError}</Alert>
          )}
          <Button type="submit" gradientDuoTone={"purpleToBlue"}>
            Update Info
          </Button>
        </form>
      </div>
      <div className=" flex-1"></div>
    </div>
  );
};

export default DashProfile;
