import api from "./api";

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    const token = response.data.token; // Assuming your API returns a token
    if (token) {
      localStorage.setItem('token', token); // Store token in localStorage
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};