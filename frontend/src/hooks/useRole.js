import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const useRole =(role)=>{
  const { user } = useContext(AuthContext);
  if (!user) {
    return false; // No user is logged in
  }

  // Check if any of the user's roles match the required role
  return user?.roles?.some((userRole) => userRole.name === role);
}

export default useRole;