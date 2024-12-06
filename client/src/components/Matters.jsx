import { Alert, Avatar, Button, FileInput, Modal } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaRegTrashCan, FaCircleExclamation } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import { CiEdit } from "react-icons/ci";
import { Link, useParams } from "react-router-dom";
import Matter from "./Matter";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { IoMdImages } from "react-icons/io";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Matters = ({ openPost, setOpenPost }) => {
  const [systemMatters, setSystemMatters] = useState([]);
  const [matterIdToDelete, setMatterIdToDelete] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [publishError, setPublishError] = useState(null);

  // const [userDetails, setUserDetails] = useState("");

  const filePicker = useRef();
  const [chooseImage, setChooseImage] = useState("Upload Image");
  const [imageFile, setImageFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUrl, setImageFileUrl] = useState(null);

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

  console.log("Post matters", systemMatters);
  const getMatters = async () => {
    try {
      const res = await axios.get(
        `/api/matter/getmatters?systemId=${systemDetails._id}`
      );
      if (res.status === 200) {
        setSystemMatters(res.data.matters);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // create matter
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
        console.log("insta", data);
        setFormData(null);
        setOpenPost(false);
        setSystemMatters([res.data, ...systemMatters]);
        // getSystem();
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

  const handleDeleteMatter = async (matterId) => {
    // console.log("idtdel", matterIdToDelete);

    try {
      const res = await axios.delete(
        `/api/matter/deletematter/${matterId}/${systemDetails._id}/${currentUser._id}`
      );

      if (res.status === 200) {
        setSystemMatters((prev) => {
          prev.filter((matter) => matter._id !== matterId);
        });
        setOpenModal(false);
        getMatters();
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    getMatters();
  }, [systemDetails._id]);

  const handleConfirm = async (matterId) => {
    try {
      const res = await axios.put(`/api/matter/likematter/${matterId}`);
      if (res.status === 200) {
        setSystemMatters(
          systemMatters.map((matter) =>
            matter._id === matterId
              ? {
                  ...matter,
                  likes: res.data.likes,
                  numberOfLikes: res.data.length,
                }
              : matter
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {systemMatters && systemMatters.length > 0 ? (
        <>
          {systemMatters.map((matter) => (
            <Matter
              key={matter._id}
              matter={matter}
              onConfirm={handleConfirm}
              onDelete={(matterId) => {
                setOpenModal(true);
                setMatterIdToDelete(matterId);
              }}
            />
          ))}
        </>
      ) : (
        <p>There are no Matters yet</p>
      )}
      <Modal
        popup
        size={"sm"}
        onClose={() => setOpenModal(false)}
        show={openModal}
      >
        <Modal.Header />
        <Modal.Body>
          <div className=" text-center">
            <FaCircleExclamation className=" w-10 h-10 mx-auto mb-4 text-red-500" />
            <h3 className=" text-lg mb-4 text-gray-500">
              Are You sure you want to delete this matter?
            </h3>
            <div className=" flex justify-center gap-4">
              <Button
                outline
                color={"failure"}
                onClick={() => handleDeleteMatter(matterIdToDelete)}
              >
                <FaRegTrashCan className=" text-red-500 text-lg" />
              </Button>
              <Button outline onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
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

export default Matters;
