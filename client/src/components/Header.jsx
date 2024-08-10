import { Button, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { LuSearchCode } from "react-icons/lu";
import { FaRegMoon } from "react-icons/fa";

const Header = () => {
  const path = useLocation().pathname;

  return (
    <Navbar className=" border-b-2">
      <Link
        to={"/"}
        className=" self-center whitespace-nowrap text-sm sm:text-xl font-sans font-semibold dark:text-white"
      >
        <span className=" text-xltext-white px-2 sm:text-2xl border-[1px] rounded-full">
          {"O'"}
        </span>
        SYSTEM
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="search...."
          name="search"
          rightIcon={LuSearchCode}
          className=" hidden lg:inline"
        />
      </form>
      <Button className=" w-12 h-10 lg:hidden" pill color={"gray"}>
        <LuSearchCode />
      </Button>
      <div className=" flex gap-2 md:order-2">
        <Button className=" w-12 h-10 hidden sm:inline" color={"gray"} pill>
          <FaRegMoon />
        </Button>
        <Link to="/sign-in">
          <Button gradientDuoTone={"purpleToBlue"}>Sign In</Button>
        </Link>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={"div"} active={path === "/"}>
          <Link to={"/"}>HOME</Link>
        </Navbar.Link>
        <Navbar.Link as={"div"} active={path === "/about"}>
          <Link to={"/about"}>ABOUT</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
