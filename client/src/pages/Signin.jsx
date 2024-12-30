import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import Oauth from "../components/Oauth";

const Signin = () => {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (ev) => {
    const { value, name } = ev.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all fields"));
    }
    try {
      dispatch(signInStart());
      const res = await axios.post("/api/auth/signin", formData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(res);
      if (res.status === 200) {
        dispatch(signInSuccess(res.data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      if (error.status !== 200) {
        dispatch(signInFailure(error.response.data.message));
      }
    }
  };

  return (
    <div className=" min-h-screen mt-20">
      <div className=" flex max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5 p-5">
        {/* left */}
        <div className=" flex-1">
          <Link
            to={"/"}
            className=" font-bold dark:text-white flex items-center text-4xl"
          >
            <Button outline gradientDuoTone={"purpleToBlue"} pill>
              <p className=" text-xl sm:text-2xl">{"O'"}</p>
            </Button>
            system
          </Link>
          <p className=" text-sm mt-5 italic font-thin">
            This is a platform where anyone can speak their mind(specically what
            is right to be said) without been noticed or tracked. <br />
            You can sign in with your email and password
          </p>
        </div>

        {/* right */}
        <div className=" flex-1">
          <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                name="email"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="************"
                name="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone={"purpleToBlue"}
              type="submit"
              outline
              pill
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size={"sm"} />
                  <span className=" pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <Oauth />
          </form>
          <div className=" flex gap-2 text-sm mt-5">
            <span>Dont have an account?</span>
            <Link to={"/sign-up"} className=" text-blue-500">
              Sign up
            </Link>
          </div>
          {errorMessage && (
            <Alert className=" mt-5" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signin;
