import React, { useState, useEffect } from "react";
import { permissionsApi, updateRolePermissionApi } from "../../api/authApi";
import { toast } from "react-toastify";

function RolePermissionModal({
  role,
  open,
  closeModal,
  updateRolePermissions,
}) {
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [RolePermissonData, setRolePermissonData] = useState({
    role_id: "",
    permissions_to_add: [],
    permissions_to_remove: [],
  });

  // Fetch permissions only when modal opens
  useEffect(() => {
    const getPermissions = async () => {
      try {
        const response = await permissionsApi();
        setPermissions(response.data.permissions);
      } catch (error) {
        toast.error(error.message || "Failed to fetch permissions.");
      }
    };

    if (open) {
      getPermissions(); // Fetch permissions when the modal is open
    }

    // Cleanup function: reset permissions when modal is closed
    return () => {
      setPermissions([]); // Clear permissions when modal is closed
      setRolePermissions([]); // Clear rolePermissions when modal is closed
    };
  }, [open]); // Only depend on 'open'

  // Initialize rolePermissions after permissions are fetched and role is available
  useEffect(() => {
    if (permissions.length > 0 && role) {
      const initialPermissions = permissions.map((permission) => ({
        ...permission,
        isChecked: role.permissions.some((p) => p.id === permission.id),
      }));
      setRolePermissions(initialPermissions);
    }
    // Set role_id in RolePermissonData
    setRolePermissonData((prevData) => ({
      ...prevData,
      role_id: role?.id,
    }));
  }, [permissions, role]); // This effect runs only when 'permissions' or 'role' changes

  // Handle checkbox toggle
  const handleCheckboxChange = (permissionId) => {
    setRolePermissions((prev) => {
      const updatedPermissions = prev.map((permission) => {
        if (permission.id === permissionId) {
          const isChecked = !permission.isChecked;
          return {
            ...permission,
            isChecked,
          };
        }
        return permission;
      });

      // Update RolePermissonData based on checkbox state
      setRolePermissonData((prevData) => {
        const permissionsToAdd = new Set(prevData.permissions_to_add);
        const permissionsToRemove = new Set(prevData.permissions_to_remove);

        if (updatedPermissions.find((p) => p.id === permissionId).isChecked) {
          permissionsToAdd.add(permissionId);
          permissionsToRemove.delete(permissionId);
        } else {
          permissionsToRemove.add(permissionId);
          permissionsToAdd.delete(permissionId);
        }

        return {
          ...prevData,
          permissions_to_add: Array.from(permissionsToAdd),
          permissions_to_remove: Array.from(permissionsToRemove),
        };
      });

      return updatedPermissions;
    });
  };

  console.log(RolePermissonData);

  const updateRolePermission = async () => {
    try {
      const response = await updateRolePermissionApi(RolePermissonData);
      toast.success(response.message);
      closeModal();
    } catch (error) {
      toast.error(error.message || "Failed to update permissions.");
    }
  };

  // Save changes
  const handleSave = () => {
    updateRolePermission();
    const updatedPermissions = rolePermissions.filter((p) => p.isChecked);
    updateRolePermissions(role.id, updatedPermissions);
    closeModal();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Edit Permissions for {role?.name}
        </h2>
        <div className="space-y-4">
          {rolePermissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Column */}
              <ul className="space-y-2">
                {rolePermissions.slice(0, 10).map((permission) => (
                  <li
                    key={permission.id}
                    className="flex items-center text-lg text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={permission.isChecked || false}
                      onChange={() => handleCheckboxChange(permission.id)}
                      className="mr-2"
                    />
                    {permission.name}
                  </li>
                ))}
              </ul>

              {/* Second Column */}
              {rolePermissions.length > 10 && (
                <ul className="space-y-2">
                  {rolePermissions.slice(10, 20).map((permission) => (
                    <li
                      key={permission.id}
                      className="flex items-center text-lg text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={permission.isChecked || false}
                        onChange={() => handleCheckboxChange(permission.id)}
                        className="mr-2"
                      />
                      {permission.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No permissions assigned.</p>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default RolePermissionModal;
