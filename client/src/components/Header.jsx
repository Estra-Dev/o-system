import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { LuSearchCode } from "react-icons/lu";
import { FaRegMoon } from "react-icons/fa";
import { useSelector } from "react-redux";

const Header = () => {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);

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
        {!currentUser ? (
          <Link to="/sign-in">
            <Button gradientDuoTone={"purpleToBlue"} outline>
              Sign In
            </Button>
          </Link>
        ) : (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className=" block text-xs">
                {currentUser.firstname + " " + currentUser.lastname}
              </span>
              <span className=" block text-xs font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item>Sign Out</Dropdown.Item>
          </Dropdown>
        )}
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
