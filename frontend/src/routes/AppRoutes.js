import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import React, { useContext, useEffect } from "react";
import Home from "../pages/Home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import { AuthContext } from "../contexts/AuthContext";
import Leads from "../pages/leads";
import Followups from "../pages/followups";
import Settings from "../pages/settings";
import RegisterUser from "../components/users/RegisterUsers";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation(); // Use this to track the current path

  useEffect(() => {
    if (!user) {
      // Save the current path to localStorage before redirecting to Login
      localStorage.setItem("redirectAfterLogin", location.pathname);
    }
  }, [user, location.pathname]);

  const renderRoute = (path, component) => (
    <Route path={path} element={user ? component : <Navigate to="/" />} />
  );

  return (
    <Routes>
      {renderRoute("/home", <Home />)}
      <Route
        path="/"
        element={
          !user ? (
            <Login />
          ) : (
            // Redirect to the previously saved path, or `/home` as fallback
            <Navigate
              to={localStorage.getItem("redirectAfterLogin") || "/home"}
            />
          )
        }
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/home" />}
      />
      {renderRoute("/leads", <Leads />)}
      {renderRoute("/followups", <Followups />)}
      {renderRoute("/settings", <Settings />)}
      {renderRoute("/register-users", <RegisterUser />)}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
