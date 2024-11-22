import api from "./api";

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


// Login user
export const loginApi = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    const token = response.data.token; // Assuming your API returns a token
    if (token) {
      localStorage.setItem('token', token); // Store token in localStorage
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const rolesApi = async () => {
  try {
    const response = await api.get("/auth/roles");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const logoutApi = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const deleteUserApi = async (id) => {
  try {
    const response = await api.delete(`/users/${id}/delete`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const assignRoleToUserApi = async (id, role)=>{
  try {
    const response = await api.post(`users/${id}/assign-role`, role)
    return response.data
  } catch (error) {
    throw error.response.data;
    
  }
}

export const getStatistics = async () =>{
  try {
    const response = await api.get(`users/statistics`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}


export const permissionsApi  = async () => { 
  try {
    const response = await api.get(`users/roles/permissions`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const updateRolePermissionApi = async ( data) => {
  try {
    const response = await api.post(`users/roles/permissions/update`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const checkNotificationsApi = async () => {
  try {
    const response = await api.get(`notifications/check`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}