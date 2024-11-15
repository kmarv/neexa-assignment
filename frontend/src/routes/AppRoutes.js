// routes/AppRoutes.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import React, { useContext } from "react";

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

  const renderRoute = (path, component, redirectPath = "/") => (
    <Route
      path={path}
      element={user ? component : <Navigate to={redirectPath} />}
    />
  );

  return (
    <Router>
      <Routes>
        {renderRoute("/home", <Home />)}
        <Route path="/" element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" />} />
        {renderRoute("/leads", <Leads />)}
        {renderRoute("/followups", <Followups />)}
        {renderRoute("/settings", <Settings />)}
        {renderRoute("/register-users", <RegisterUser/>)}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
