import React, { useState, useEffect } from "react";
import { rolesApi } from "../../api/authApi";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import RolePermissionModal from "./RolePermissionModal";
function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolePermissionModal, setRolePermissionModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const showModal = (role) => {
    setRolePermissionModal(true);
    setSelectedRole(role); // Set the selected role when opening the modal
  };

  const hideModal = () => {
    setRolePermissionModal(false);
    setSelectedRole(null); // Properly reset the selected role when closing the modal
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await rolesApi();
        const updatedRoles = response.data.roles.map((role) => {
          // Assign isChecked = true to permissions that come with the role
          const updatedPermissions = role.permissions.map((permission) => ({
            ...permission,
            isChecked: true, // Default to checked for each permission
          }));
          return {
            ...role,
            permissions: updatedPermissions,
          };
        });

        setRoles(updatedRoles);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching roles:", error);
        toast.error("Failed to fetch roles.");
      }
    };

    fetchRoles();
  }, []);

  const toggleAccordion = (index) => {
    setRoles((prevRoles) =>
      prevRoles.map((role, i) => ({
        ...role,
        isOpen: i === index ? !role.isOpen : role.isOpen,
      }))
    );
  };

  const handleCheckboxChange = (roleId, permissionId) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId
          ? {
              ...role,
              permissions: role.permissions.map((permission) =>
                permission.id === permissionId
                  ? {
                      ...permission,
                      isChecked: !permission.isChecked,
                    }
                  : permission
              ),
            }
          : role
      )
    );
  };

  const updateRolePermissions = (roleId, updatedPermissions) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId ? { ...role, permissions: updatedPermissions } : role
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900 text-center">
        Manage Roles and Permissions
      </h1>
      {loading ? (
        <p className="text-lg text-center text-gray-700">Loading...</p>
      ) : (
        <div className="space-y-6">
          {roles.map((role, index) => (
            <div
              key={role.id}
              className="border border-gray-300 rounded-lg   overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-2 flex justify-between items-center bg-gray-200 text-lg font-semibold text-gray-800 hover:bg-gray-300 focus:outline-none"
              >
                <span>{role.name}</span>
                {role.isOpen ? (
                  <AiOutlineUp className="text-gray-600" size={20} />
                ) : (
                  <AiOutlineDown className="text-gray-600" size={20} />
                )}
              </button>

              {role.isOpen && (
                <div className="p-6 bg-white">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Permissions:
                  </h2>
                  {role.permissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ul className="space-y-2">
                        {role.permissions
                          .slice(0, Math.ceil(role.permissions.length / 2))
                          .map((permission) => (
                            <li
                              key={permission.id}
                              className="flex items-center text-lg text-gray-700"
                            >
                              <input
                                type="checkbox"
                                checked={permission.isChecked || false}
                                onChange={() =>
                                  handleCheckboxChange(role.id, permission.id)
                                }
                                className="mr-2"
                              />
                              {permission.name}
                            </li>
                          ))}
                      </ul>
                      <ul className="space-y-2">
                        {role.permissions
                          .slice(Math.ceil(role.permissions.length / 2))
                          .map((permission) => (
                            <li
                              key={permission.id}
                              className="flex items-center text-lg text-gray-700"
                            >
                              <input
                                type="checkbox"
                                checked={permission.isChecked || false}
                                onChange={() =>
                                  handleCheckboxChange(role.id, permission.id)
                                }
                                className="mr-2"
                              />
                              {permission.name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-500">No permissions assigned.</p>
                  )}
                  <button
                    className="mt-4 bg-gradient-to-br from-sky-500 
                  via-sky-700 to-sky-900  text-white py-1 px-4 rounded"
                    onClick={() => showModal(role)}
                  >
                    Add/remove Permissions
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <RolePermissionModal
        role={selectedRole}
        open={rolePermissionModal}
        closeModal={hideModal}
        updateRolePermissions={updateRolePermissions}
      />
      ;
      <ToastContainer />
    </div>
  );
}

export default Roles;
