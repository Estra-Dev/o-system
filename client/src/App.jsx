import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import { Signup } from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import FooterCom from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import CreateSystem from "./pages/CreateSystem";
import FollowSystem from "./pages/FollowSystem";
import JoinSystem from "./pages/JoinSystem";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import System from "./pages/System";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-system" element={<CreateSystem />} />
          <Route path="/follow-system" element={<FollowSystem />} />
          <Route path="/system/:slug" element={<System />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/join-system" element={<JoinSystem />} />
        </Route>
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
      </Routes>
      <FooterCom />
    </BrowserRouter>
  );
};

export default App;
