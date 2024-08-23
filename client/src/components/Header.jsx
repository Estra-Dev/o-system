import { Button, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { LuSearchCode } from "react-icons/lu";
import { FaRegMoon } from "react-icons/fa";

const Header = () => {
  const path = useLocation().pathname;

  return (
    <Navbar className=" border-b-2 sticky top-0 left-0 z-50">
      <Link
        to={"/"}
        className=" self-center whitespace-nowrap text-sm sm:text-xl font-sans font-semibold dark:text-white flex items-center"
      >
        <Button outline gradientDuoTone={"purpleToBlue"} pill>
          <p className=" text-xl sm:text-2xl">{"O'"}</p>
        </Button>
        system
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
          <Button gradientDuoTone={"purpleToBlue"} outline>
            Sign In
          </Button>
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
