// routes/AppRoutes.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import React, { useContext } from "react";

import Home from "../pages/Home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import { AuthContext } from "../contexts/AuthContext";
import Leads from "../pages/leads";
import Followups from "../pages/followups";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
        <Route path="/" element={!user ? <Login /> : <Navigate to="/home" />} />

        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/home" />}
        />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/leads" element={user ? <Leads /> : <Navigate to="/" />} />
        <Route path="/followups" element={user ? <Followups /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
