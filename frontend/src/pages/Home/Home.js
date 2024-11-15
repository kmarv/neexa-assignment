import React, { useState } from "react";
import {
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaHome,
} from "react-icons/fa";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileOpen(!profileOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Side bar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-gradient-to-b from-gray-800 to-gray-900 text-white w-64 md:static md:translate-x-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-xl`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <span className="text-2xl font-bold">LM&FUS</span>
          <button className="md:hidden text-white" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li className="group flex items-center px-4 py-3 hover:bg-gray-700 rounded-md transition-colors duration-200 cursor-pointer">
              <FaHome className="mr-3 group-hover:text-emerald-400" />
              <span className="group-hover:text-emerald-400">Leads</span>
            </li>
            <li className="group flex items-center px-4 py-3 hover:bg-gray-700 rounded-md transition-colors duration-200 cursor-pointer">
              <FaUserCircle className="mr-3 group-hover:text-emerald-400" />
              <span className="group-hover:text-emerald-400">Follow Ups</span>
            </li>
            <li className="group flex items-center px-4 py-3 hover:bg-gray-700 rounded-md transition-colors duration-200 cursor-pointer">
              <FaCog className="mr-3 group-hover:text-emerald-400" />
              <span className="group-hover:text-emerald-400">Settings</span>
            </li>
            <li className="group flex items-center px-4 py-3 hover:bg-gray-700 rounded-md transition-colors duration-200 cursor-pointer">
              <FaSignOutAlt className="mr-3 group-hover:text-emerald-400" />
              <span className="group-hover:text-emerald-400">Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="w-full bg-white shadow-md p-4 flex justify-between items-center">
          <button className="md:hidden text-gray-600" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div className="text-xl font-semibold text-gray-700">Dashboard</div>
          <div className="relative">
            <FaUserCircle
              className="text-3xl text-gray-600 cursor-pointer hover:text-emerald-500 transition-colors duration-200"
              onClick={toggleProfileDropdown}
            />
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
