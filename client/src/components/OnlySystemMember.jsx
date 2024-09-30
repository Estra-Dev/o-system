import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const OnlySystemMember = () => {
  const { systemDetails } = useSelector((state) => state.system);
  const { currentUser } = useSelector((state) => state.user);

  return currentUser && systemDetails.members.includes(currentUser._id) ? (
    <Outlet />
  ) : (
    Navigate("/signin")
  );
};

export default OnlySystemMember;
