import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  Alert,
  Button,
  FileInput,
  Label,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useRef, useState } from "react";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CreateSystem = () => {
  const filePicker = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [chooseImage, setChooseImage] = useState("Choose an Image");
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});

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
          setImageUploadError("Encountered an error trying to upload Image");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, logo: downloadUrl });
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

  return (
    <div className=" max-w-3xl mx-auto min-h-screen p-3">
      <h1 className=" text-center text-3xl font-semibold my-7 text-gray-900">
        Create Your System
      </h1>
      <form className=" flex flex-col gap-4">
        <div className=" flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className=" flex flex-col gap-2 flex-1">
            <Label htmlFor="name">System Name</Label>
            <TextInput
              type="text"
              name="name"
              placeholder="E.g: O'system"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Select>
              <option value={"uncategorize"}>Select a category</option>
              <option value={"politics"}>Politics</option>
              <option value={"economy"}>Economy</option>
              <option value={"public"}>Public</option>
              <option value={"private"}>Private</option>
              <option value={"religious"}>Religious</option>
              <option value={"governmental"}>Governmental</option>
              <option value={"ideological"}>Ideological</option>
              <option value={"societal"}>Societal</option>
              <option value={"Relationship"}>Relationship</option>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">System Description</Label>
          <TextInput
            type="text"
            name="description"
            placeholder="E.g: This is a system for all..."
            required
          />
        </div>
        <div className=" flex items-center justify-between gap-4">
          <p
            className=" font-bold text-sm text-white rounded-lg p-2 bg-gray-700 cursor-pointer truncate"
            onClick={() => filePicker.current.click()}
          >
            {chooseImage}
          </p>
          <FileInput
            className=" hidden"
            type="file"
            accept="image/*"
            ref={filePicker}
            onChange={handleLogoChange}
          />
          <Button
            type="button"
            outline
            onClick={handleUploadImage}
            size={"sm"}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <>
                <Spinner />
                <span className=" ml-2">Uploading...</span>
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
        {imageUploadError && (
          <Alert color={"failure"}>{imageUploadError}</Alert>
        )}
        <div className=" w-[170px] h-[170px] mt-7 mx-auto overflow-hidden rounded-full border border-teal-500 p-2">
          {imageUploadProgress ? (
            <div className=" w-full h-full">
              <CircularProgressbar
                value={imageUploadProgress}
                text={`${imageUploadProgress || 0}%`}
              />
            </div>
          ) : (
            <img
              className=" rounded-full object-cover w-full h-full"
              src={
                imageFileUrl ||
                formData.logo ||
                `http://ts1.mm.bing.net/th?id=OIP.z1qiTo8DMqQhhAtW7NfLsQHaHa&pid=15.1`
              }
              alt="logo"
            />
          )}
        </div>
        <Button
          type="submit"
          className=" w-[300px] mt-4 mx-auto"
          gradientDuoTone={"purpleToBlue"}
        >
          Create System
        </Button>
      </form>
    </div>
  );
};

export default CreateSystem;
