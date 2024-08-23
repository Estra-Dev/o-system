import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Signup = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (ev) => {
    const { value, name } = ev.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  console.log(formData);

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    setLoading(false);
    setErrorMessage(null);
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.anon_name ||
      !formData.email ||
      !formData.password
    ) {
      return setErrorMessage("Please fill all fields");
    }
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/signup", formData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(res);
      setLoading(false);
      if (res.status === 200) {
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error);
      if (error.status !== 200) {
        setErrorMessage(error.response.data.message);
        setLoading(false);
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
            is right to be said) without been noticed or tracked.
          </p>
          <p className=" text-sm italic font-thin">Fill the form to sign up.</p>
        </div>

        {/* right */}
        <div className=" flex-1">
          <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your First Name" />
              <TextInput
                type="text"
                placeholder="First Name"
                name="firstname"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label value="Your Last Name" />
              <TextInput
                type="text"
                placeholder="Last Name"
                name="lastname"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label value="Your Anonymous Name" />
              <TextInput
                type="text"
                placeholder="Anonymous Name"
                name="anon_name"
                onChange={handleChange}
              />
            </div>
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
                placeholder="password"
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
                "Sign Up"
              )}
            </Button>
          </form>
          <div className=" flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to={"/sign-in"} className=" text-blue-500">
              Sign in
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
