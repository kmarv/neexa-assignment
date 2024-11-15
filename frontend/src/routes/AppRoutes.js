// routes/AppRoutes.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import React, { useContext } from "react";

import Home from "../pages/Home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/register/register";
import { AuthContext } from "../contexts/AuthContext";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
