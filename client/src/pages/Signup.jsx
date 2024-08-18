import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export const Signup = () => {
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
            You can sign up with your email and password
          </p>
        </div>

        {/* right */}
        <div className=" flex-1">
          <form className=" flex flex-col gap-4">
            <div className="">
              <Label value="Your First Name" />
              <TextInput
                type="text"
                placeholder="First Name"
                name="firstname"
              />
            </div>
            <div className="">
              <Label value="Your Last Name" />
              <TextInput type="text" placeholder="Last Name" name="lastname" />
            </div>
            <div className="">
              <Label value="Your Anonymous Name" />
              <TextInput
                type="text"
                placeholder="Anonymous Name"
                name="anon_name"
              />
            </div>
            <div className="">
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                name="email"
              />
            </div>
            <div className="">
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="password"
                name="password"
              />
            </div>
            <Button gradientDuoTone={"purpleToBlue"} type="submit" outline pill>
              Sign Up
            </Button>
          </form>
          <div className=" flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to={"/sign-in"} className=" text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
