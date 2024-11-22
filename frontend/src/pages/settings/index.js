import React, { useState, useEffect } from "react";
import Layout from "../Home/Home";
import {
  deleteUserApi,
  getUsers,
  assignRoleToUserApi,
  rolesApi,
} from "../../api/authApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Roles from "../../components/users/Roles";

function Settings() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
   const [activeTab, setActiveTab] = useState("users");

  const fetchUsersAndRoles = async () => {
    try {
      const usersResponse = await getUsers();
      const rolesResponse = await rolesApi();
      setUsers(usersResponse.data.users);
      setRoles(rolesResponse.data.roles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteUserApi(userId);
        setUsers(users.filter((user) => user.id !== userId));
        Swal.fire("Deleted!", "User has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "There was an issue deleting the user.", "error");
      }
    }
  };

  const handleAssign = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleAssignRole = async () => {
    if (!selectedRole) {
      Swal.fire("Error", "Please select a role.", "error");
      return;
    }

    try {
      const reqBody = { role: selectedRole };
      await assignRoleToUserApi(selectedUserId, reqBody);
      setIsModalOpen(false);
      fetchUsersAndRoles();
      Swal.fire("Success", "Role has been assigned.", "success");
    } catch (error) {
      Swal.fire("Error", "There was an issue assigning the role.", "error");
    }
  };

  const handleAddUser = () => {
    // Action to open a modal or redirect to add user functionality
   navigate('/register-users')
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          System Settings
        </h1>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded-t-lg ${
              activeTab === "users"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`px-6 py-2 rounded-t-lg ${
              activeTab === "roles"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Roles Management
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow-md rounded-lg p-4">
          {activeTab === "users" && (
            <>
              <div className="mb-4 flex justify-end">
                <button
                  onClick={handleAddUser}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add User
                </button>
              </div>

              {loading ? (
                <p className="text-center text-lg">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-700">#</th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-700">Roles</th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4 text-sm text-gray-700">
                            {index + 1}
                          </td>
                          <td className="py-2 px-4 text-sm text-gray-700">
                            {user.name}
                          </td>
                          <td className="py-2 px-4 text-sm text-gray-700">
                            {user.email}
                          </td>
                          <td className="py-2 px-4 text-sm text-gray-700">
                            {user.roles.map((role) => role.name).join(", ")}
                          </td>
                          <td className="py-2 px-4 text-sm text-gray-700">
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 mr-2"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleAssign(user.id)}
                              className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600"
                            >
                              Assign
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === "roles" && (
            <div>
             <Roles />
            </div>
          )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h2 className="text-xl font-semibold mb-4">Assign Role</h2>
              <div className="mb-4">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Role
                </label>
                <select
                  id="role"
                  value={selectedRole || ""}
                  onChange={handleRoleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignRole}
                  className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
                >
                  Assign Role
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </Layout>
  );
}

export default Settings;
