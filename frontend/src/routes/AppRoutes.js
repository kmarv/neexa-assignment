// routes/AppRoutes.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import React, { useContext } from "react";

import Home from "../pages/Home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import { AuthContext } from "../contexts/AuthContext";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
console.log(user);
  return (
    <Router>
      <Routes>
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/home" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/home" />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
