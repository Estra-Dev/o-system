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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  createStart,
  createSuccess,
  createError,
} from "../redux/system/systemSlice";

const CreateSystem = () => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.system);
  const filePicker = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [chooseImage, setChooseImage] = useState("Choose an Image");
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [createSystemError, setCreateSystemError] = useState(null);
  const navigate = useNavigate();

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

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData({ ...formData, [name]: value });
  };
  console.log(formData);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    dispatch(createStart());
    try {
      const res = await axios.post(`/api/system/createsystem`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      const data = res.data;
      if (res.status === 201) {
        dispatch(createSuccess(data));
        navigate(`/system/${data.slug}?tab=matters`);
        console.log(data);
      }
    } catch (error) {
      dispatch(createError(error.response.data.message));
      console.log(error);
    }
  };

  return (
    <div className=" max-w-3xl mx-auto min-h-screen p-3">
      <h1 className=" text-center text-3xl font-semibold my-7 text-gray-900">
        Create Your System
      </h1>
      <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className=" flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className=" flex flex-col gap-2 flex-1">
            <Label htmlFor="name">System Name</Label>
            <TextInput
              type="text"
              name="name"
              placeholder="E.g: O'system"
              required
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onChange={handleChange}
              value={formData.category}
              name="category"
            >
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
            onChange={handleChange}
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
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner />
              <span>Creating Your System...</span>
            </>
          ) : (
            "Create System"
          )}
        </Button>
        {error && (
          <Alert color={"failure"} className=" my-5">
            {error}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default CreateSystem;
