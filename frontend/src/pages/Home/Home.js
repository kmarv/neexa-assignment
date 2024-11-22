import React, { useContext, useEffect, useState } from "react";
import {
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaHome,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import {  checkNotificationsApi, getStatistics } from "../../api/authApi";
import { toast } from "react-toastify";
import useRole from "../../hooks/useRole";
import Loader from "../../components/Loader";
import { IoNotificationsCircleSharp } from "react-icons/io5";
import Notifications from "../../components/notifications/Notifications";

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const isAdmin = useRole("Admin");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [checkNotifications, setCheckNotifications] = useState([]);
  const [refresh, setRefresh] = useState(false);


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileOpen(!profileOpen);
  };

  const toggleNotificationDropdown = () => {
    setNotificationOpen(!notificationOpen);
  };

  const checkForNotifications = async () =>{
    try {
      const response = await checkNotificationsApi();
      setCheckNotifications(response);
    } catch (error) {
      console.error(error);
    }
  }

  // Function to map current route to the title
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/leads":
        return "Leads";
      case "/profile":
        return "Profile";
      case "/settings":
        return "Settings";
      default:
        return "MyApp";
    }
  };

  const handleLogout = async() => {
    // await logoutApi();
    logout();
  }

  const getStat = async () =>{
    try{
      const response = await getStatistics();
      setStats(response)
    } catch (error) {
      toast.error("Stats not Fetched")
    }
  }

  useEffect(() => {
    
    getStat();
    checkForNotifications()
  }, []);
  useEffect(() => {
        checkForNotifications();
  }, [refresh]);

  return (
    <div className="flex h-screen  bg-gray-100">
      {/* Side bar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-gradient-to-b from-gray-800  z-20 to-gray-900 text-white w-64 md:static md:translate-x-0 transform ${
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
              <Link to="/leads" className="flex items-center">
                <FaHome className="mr-3 group-hover:text-emerald-400" />
                <span className="group-hover:text-emerald-400">Leads</span>{" "}
              </Link>
            </li>
            <li className="group flex items-center px-4 py-3 hover:bg-gray-700 rounded-md transition-colors duration-200 cursor-pointer">
              <Link to="/followups" className="flex items-center">
                <FaUserCircle className="mr-3 group-hover:text-emerald-400" />
                <span className="group-hover:text-emerald-400">Follow Ups</span>
              </Link>
            </li>
            {isAdmin && (
              <li className="group flex items-center px-4 py-3 hover:bg-gray-700 rounded-md transition-colors duration-200 cursor-pointer">
                <Link to="/settings" className="flex items-center">
                  <FaCog className="mr-3 group-hover:text-emerald-400" />
                  <span className="group-hover:text-emerald-400">Settings</span>
                </Link>
              </li>
            )}
            <li className="group flex items-center px-4 py-3 hover:bg-gray-700 rounded-md transition-colors duration-200 cursor-pointer">
              <FaSignOutAlt className="mr-3 group-hover:text-emerald-400" />
              <span
                onClick={handleLogout}
                className="group-hover:text-emerald-400"
              >
                Logout
              </span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="w-full bg-white shadow-md p-4 flex justify-between items-center">
          <button className="md:hidden text-gray-600" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div className="text-xl font-semibold text-gray-700">
            {getPageTitle()} {/* Dynamically set the page title */}
          </div>
          <div className="relative flex items-center gap-3">
            <div>
              <IoNotificationsCircleSharp
                className={`text-4xl cursor-pointer transition-colors duration-200 ${
                  checkNotifications.has_new_notifications
                    ? "text-red-500 animate-bellRing"
                    : "text-gray-600 hover:text-emerald-500"
                }`}
                onClick={toggleNotificationDropdown}
              />
              {checkNotifications.has_new_notifications && (
                <div className="absolute top-0  text-xs text-white bg-red-500 rounded-full px-1">
                  {checkNotifications.new_notifications_count}
                </div>
              )}
            </div>
            {notificationOpen && (
              <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg min-w-96 py-2 z-50 max-h-96 overflow-y-auto">
                <div className="border-b border-gray-200 px-4 py-2">
                  <p className="text-gray-800 font-medium">Notifications</p>
                </div>
                <Notifications refresh={refresh} setRefresh={setRefresh} />
              </div>
            )}

            {/* User Info */}
            <div className="text-sm">
              <p className="font-medium text-gray-700">
                {user.name}{" "}
                <span className="text-red-400 font-semibold">
                  ({user?.roles?.[0]?.name || "Role"})
                </span>
              </p>
            </div>

            {/* User Icon */}
            <FaUserCircle
              className="text-3xl text-gray-600 cursor-pointer hover:text-emerald-500 transition-colors duration-200"
              onClick={toggleProfileDropdown}
            />

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg w-48 py-2 z-50">
                <div className="border-b border-gray-200 px-4 py-2">
                  <p className="text-gray-800 font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">
                    {user?.roles?.[0]?.name}
                  </p>
                </div>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700 transition duration-150"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-auto">
          {children ? (
            children
          ) : stats ? (
            <div className="grid grid-cols-1 gap-6">
              {/* First Row: Leads and Follow-ups Count */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Leads Count Card */}
                <div
                  className="bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-xl rounded-lg p-6 flex items-center justify-between hover:shadow-2xl transition-shadow duration-300"
                  onClick={() => navigate("/leads")}
                >
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      Leads Count
                    </h3>
                    <p className="text-4xl font-bold text-white mt-2">
                      {stats?.leads_count ?? 0}
                    </p>
                  </div>
                  <div className="text-white text-5xl">
                    <FaHome />
                  </div>
                </div>

                {/* Follow-ups Count Card */}
                <div
                  className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl rounded-lg p-6 flex items-center justify-between hover:shadow-2xl transition-shadow duration-300"
                  onClick={() => navigate("/followups")}
                >
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      Follow-ups Count
                    </h3>
                    <p className="text-4xl font-bold text-white mt-2">
                      {stats?.follow_ups_count ?? 0}
                    </p>
                  </div>
                  <div className="text-white text-5xl">
                    <FaUserCircle />
                  </div>
                </div>
              </div>

              {/* Second Row: Follow-ups by Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Follow-ups Card */}
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-xl rounded-lg p-6 flex items-center justify-between hover:shadow-2xl transition-shadow duration-300">
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      Pending Follow-ups
                    </h3>
                    <p className="text-4xl font-bold text-white mt-2">
                      {stats?.follow_ups?.pending ?? 0}
                    </p>
                  </div>
                  <div className="text-white text-5xl">
                    <FaClock />
                  </div>
                </div>

                {/* Completed Follow-ups Card */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 shadow-xl rounded-lg p-6 flex items-center justify-between hover:shadow-2xl transition-shadow duration-300">
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      Completed Follow-ups
                    </h3>
                    <p className="text-4xl font-bold text-white mt-2">
                      {stats?.follow_ups?.completed ?? 0}
                    </p>
                  </div>
                  <div className="text-white text-5xl">
                    <FaCheckCircle />
                  </div>
                </div>

                {/* Missed Follow-ups Card */}
                <div className="bg-gradient-to-br from-red-500 to-red-600 shadow-xl rounded-lg p-6 flex items-center justify-between hover:shadow-2xl transition-shadow duration-300">
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      Missed Follow-ups
                    </h3>
                    <p className="text-4xl font-bold text-white mt-2">
                      {stats?.follow_ups?.missed ?? 0}
                    </p>
                  </div>
                  <div className="text-white text-5xl">
                    <FaExclamationCircle />
                  </div>
                </div>
              </div>

              {/* Third Row: Sales Reps and Managers Count (Conditional Rendering) */}
              {stats.sales_reps_count !== undefined &&
                stats.sales_managers_count !== undefined && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sales Reps Count Card */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl rounded-lg p-6 flex items-center justify-between hover:shadow-2xl transition-shadow duration-300">
                      <div>
                        <h3 className="text-lg font-medium text-white">
                          Sales Reps Count
                        </h3>
                        <p className="text-4xl font-bold text-white mt-2">
                          {stats?.sales_reps_count ?? 0}
                        </p>
                      </div>
                      <div className="text-white text-5xl">
                        <FaUsers />
                      </div>
                    </div>

                    {/* Sales Managers Count Card */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 shadow-xl rounded-lg p-6 flex items-center justify-between hover:shadow-2xl transition-shadow duration-300">
                      <div>
                        <h3 className="text-lg font-medium text-white">
                          Sales Managers Count
                        </h3>
                        <p className="text-4xl font-bold text-white mt-2">
                          {stats?.sales_managers_count ?? 0}
                        </p>
                      </div>
                      <div className="text-white text-5xl">
                        <FaUserTie />
                      </div>
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 text-lg animate-pulse">
                Loading stats...
              </p>
              <Loader />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;
