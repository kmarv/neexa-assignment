import { useMemo } from "react";

const useHasPermission = (role, permissionToCheck) => {
  /**
   * role: Object with a `permissions` field that contains an array of permission objects.
   * permissionToCheck: The permission name or ID to check for.
   */

  const hasPermission = useMemo(() => {
    if (!role || !role.permissions || !permissionToCheck) {
      return false;
    }


    return role.permissions.some(
      (permission) =>
        permission.name === permissionToCheck ||
        permission.id === permissionToCheck
    );
  }, [role, permissionToCheck]);

  return hasPermission;
};

export default useHasPermission;
