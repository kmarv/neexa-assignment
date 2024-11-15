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

export const roles = async () => {
  try {
    const response = await api.get("/auth/roles");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}