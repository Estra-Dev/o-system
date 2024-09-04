import { Alert, Button, Label, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
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

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUpploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUpploadingError, setImageFileUploadingError] = useState(null);

  const filePicker = useRef();

  const handleSubmit = (ev) => {
    ev.preventDefault();
  };

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
        });
      }
    );
  };

  return (
    <div className=" w-full flex flex-col md:flex-row relative">
      <div className={` p-4 pb-8 rounded-r-md shadow-md lg:w-[25%] relative `}>
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
        {imageFileUpploadingError && (
          <Alert color={"failure"}>{imageFileUpploadingError}</Alert>
        )}
        <form>
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePicker}
          />
        </form>
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
      </div>
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
            />
          </div>
          <div className="">
            <Label htmlFor="lastname">Last Name</Label>
            <TextInput
              type="text"
              placeholder="Your Last Name"
              name="lastname"
              defaultValue={currentUser.lastname}
            />
          </div>
          <div className="">
            <Label htmlFor="email">Email</Label>
            <TextInput
              type="email"
              placeholder="name@company.com"
              name="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="">
            <Label htmlFor="password">Password</Label>
            <TextInput type="password" placeholder="password" name="password" />
          </div>
          <Button
            type="submit"
            gradientDuoTone={"purpleToBlue"}
            onClick={() => setShowForm(false)}
          >
            Update Info
          </Button>
        </form>
      </div>
      <div className=" flex-1"></div>
    </div>
  );
};

export default DashProfile;
