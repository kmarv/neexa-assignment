import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";

class App extends Component {
  render() {
    return (
      <div className="App">
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </div>
    );
  }
}

export default App;
