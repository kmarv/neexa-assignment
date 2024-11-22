import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
} from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className="App">
        <AuthProvider>
          <Router>
          <AppRoutes />
          </Router>
        </AuthProvider>
        <ToastContainer />
      </div>
    );
  }
}

export default App;
