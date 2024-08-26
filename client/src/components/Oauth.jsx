import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const Oauth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultFromGoogle);

      const res = await axios.post(
        "/api/auth/google",
        {
          firstname: resultFromGoogle._tokenResponse.firstName,
          lastname: resultFromGoogle._tokenResponse.lastName,
          email: resultFromGoogle._tokenResponse.email,
          googlePhotoUrl: resultFromGoogle._tokenResponse.photoUrl,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200) {
        dispatch(signInSuccess(res.data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      type="button"
      gradientDuoTone={"purpleToPink"}
      pill
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className=" w-6 h-6 mr-2" /> Continue with Google
    </Button>
  );
};

export default Oauth;
