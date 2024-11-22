import React, { useState, useEffect } from "react";
import { fetchNotificationsApi, markNotificationAsReadApi } from "../../api/leadsApi";
import { toast } from "react-toastify";

function Notifications({ refresh, setRefresh }) {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await fetchNotificationsApi();
      setNotifications(response);
    } catch (error) {
      toast.error(
        error.message || "Failed to fetch notifications. Please try again."
      );
    }
  };



  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
        const response =await  markNotificationAsReadApi(id);
        toast.success(response.message || "Notification marked as read.");
        fetchNotifications();
        setRefresh(!refresh);
    } catch (error) {
        toast.error(error.message || "Failed to mark notification as read.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start p-4 border-l-4 ${
                notification.read_at ? "bg-gray-100" : "bg-blue-100"
              } rounded-lg shadow-md`}
            >
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="text-blue-500"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M3 2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2zm2 1v18h14V3H5z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-800">
                  {notification.data.message}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => markAsRead(notification.id)}
                className={`ml-4 px-3 py-1 text-sm font-semibold ${
                  notification.read_at
                    ? "bg-gray-300"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded-full transition duration-300`}
              >
                {notification.read_at ? "Read" : "Mark as Read"}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No notifications available.
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
