import React, { useState, useEffect, useContext } from "react";
import { loginApi } from "../../api/authApi";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({

    email: "",
    password: "",
  
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formErrors, setFormErrors] = useState({

    email: "",
    password: "",
   
  });

  

  // Validate the form fields
  const validateForm = () => {
    let errors = {};
    const {  email, password } = formData;

  
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Please enter a valid email address.";
    if (!password) errors.password = "Password is required.";
   setLoading(false);

    return errors;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" })); // Reset the error message for that field
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFormErrors({});
setLoading(true);
    // Validate the form before submission
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // Stop submission if there are validation errors
    }

    try {
      const form = new FormData();
      // Convert formData state to FormData object
      for (let key in formData) {
        form.append(key, formData[key]);
      }

      const response = await loginApi(form); // Send FormData to API
      login(response.user);
      toast.success(response.message);
      setSuccess(response.message);
      setLoading(false);
      console.log(response);
      localStorage.setItem("token", response.access_token);
      navigate("/home");
    } catch (err) {
      console.log(err)
      toast.error( err.error || "Something went wrong.");
      setLoading(false);
      setError(
         err.error || "Something went wrong."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
            {formErrors.email && (
              <p className="text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
            {formErrors.password && (
              <p className="text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>

          

        

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-emerald-700  via-emerald-500 to-emerald-700 text-white font-semibold rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <div className="text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-700 hover:text-emerald-500"
          >
            Register
          </Link>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
