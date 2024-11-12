import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { app } from "../firebase";
import axios from "axios";
import { IoMdImages } from "react-icons/io";
import { Alert, Button, FileInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdateMatter = () => {
  const [matter, setMatter] = useState(null);

  const { currentUser } = useSelector((state) => state.user);
  const { systemDetails } = useSelector((state) => state.system);

  const filePicker = useRef();
  const [ImageFile, setImageFile] = useState(null);
  const [ImageFileUrl, setImageFileUrl] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState("");
  const [formData, setFormData] = useState({});
  const [chooseImage, setChooseImage] = useState("upload image");
  const [updateError, setUpdateError] = useState(null);
  const navigate = useNavigate();

  const { matterId } = useParams();

  console.log("useparams", matterId);
  console.log(formData);

  const handleUploadImage = async () => {
    try {
      if (!ImageFile) {
        setImageUploadError("Please Select an Image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + ImageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, ImageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress);
        },
        (error) => {
          setImageUploadProgress(null);
          setImageUploadError("Encountered an error" + error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadurl) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({ ...formData, image: downloadurl });
            setImageFileUrl(downloadurl);
            setChooseImage("upload image");
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload error");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleEditImageChange = (ev) => {
    const file = ev.target.files[0];

    if (file) {
      setImageFile(file);
      setImageUploadError(null);
      setChooseImage(file.name);
    }
  };

  const getMatter = async () => {
    try {
      const res = await axios.get(
        `/api/matter/getmatters?matterId=${matterId}`
      );
      if (res.status === 200) {
        setUpdateError(null);
        setFormData(res.data.matters[0]);
      }
    } catch (error) {
      console.log(error);
      setUpdateError(error.response.data.message);
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (Object.keys(formData).length === 0) {
      setUpdateError("No Changes made");
      return;
    }
    try {
      const res = await axios.put(
        `/api/matter/updatematter/${formData._id}/${currentUser._id}`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("res", res);
      if (res.status === 200) {
        setUpdateError(null);
        navigate(`/system/${systemDetails.slug}?tab=matters`);
      }
    } catch (error) {
      setUpdateError(error.response.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    getMatter();
  }, [matterId]);

  return (
    <div className=" max-w-3xl mx-auto w-full p-5">
      <form onSubmit={handleSubmit}>
        {formData.image && (
          <div className=" w-full my-3 rounded-md overflow-hidden">
            <img
              src={formData.image}
              alt={ImageFileUrl}
              className=" object-cover w-full rounded-md"
            />
            <div className="">
              {chooseImage === "upload image" ? (
                <div
                  className=" font-bold text-sm text-orange-500 rounded-lg p-2 cursor-pointer truncate"
                  title={chooseImage}
                  onClick={() => filePicker.current.click()}
                >
                  <IoMdImages className=" w-10 h-10" />
                  <span>Choose another image</span>
                </div>
              ) : (
                <div className=" flex justify-between items-center">
                  {chooseImage != "upload image" ? (
                    <>
                      <span className=" truncate">You chose {chooseImage}</span>
                      <Button
                        type="button"
                        size={"sm"}
                        outline
                        gradientDuoTone={"purpleToBlue"}
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                      >
                        Upload
                      </Button>
                    </>
                  ) : (
                    <div
                      className=" font-bold text-sm text-orange-500 rounded-lg p-2 cursor-pointer truncate"
                      title={chooseImage}
                      onClick={() => filePicker.current.click()}
                    >
                      <IoMdImages className=" w-10 h-10" />
                      <span>Choose another image</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <FileInput
          className=" hidden"
          type="file"
          accept="image/*"
          ref={filePicker}
          onChange={handleEditImageChange}
        />
        <div>
          <ReactQuill
            theme="snow"
            className=" h-72 mb-20"
            required
            placeholder="Edit this content"
            onChange={(value) => {
              setFormData({
                ...formData,
                content: value,
              });
            }}
            value={formData.content}
          />
        </div>
        {imageUploadError && (
          <Alert color={"failure"}>{imageUploadError}</Alert>
        )}
        {updateError && <Alert color={"Failure"}>{updateError}</Alert>}
        <Button
          gradientDuoTone={"purpleToBlue"}
          className=" w-full"
          type="submit"
        >
          Update Matter
        </Button>
      </form>
    </div>
  );
};

export default UpdateMatter;
