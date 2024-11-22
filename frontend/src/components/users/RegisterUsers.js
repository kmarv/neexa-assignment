import React, { useState, useEffect } from "react";
import { register, rolesApi } from "../../api/authApi";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../pages/Home/Home";
import { FaUser, FaEnvelope, FaLock, FaKey, FaUserTag } from "react-icons/fa";

const RegisterUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const getRoles = async () => {
    setLoading(true);
    try {
      const response = await rolesApi();
      setUserRoles(response.data.roles);
    } catch (error) {
      toast.error("Failed to load roles.");
      setError("Failed to load roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const validateForm = () => {
    const errors = {};
    const { name, email, password, password_confirmation, role } = formData;
    if (!name) errors.name = "Name is required.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Please enter a valid email address.";
    if (!password) errors.password = "Password is required.";
    if (password !== password_confirmation)
      errors.password_confirmation = "Passwords must match.";
    if (!role) errors.role = "Please select a role.";
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    setSuccess("");
    setFormErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await register(formData);
      toast.success(response.message);
      setSuccess("Registration successful!");
      setFormData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
      });
      setLoading(false);
    } catch (err) {
      toast.error("Something went wrong.");
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className=" bg-gray-100 flex justify-center items-center overflow-auto">
        <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Register User
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              {formErrors.name && (
                <p className="text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              {formErrors.email && (
                <p className="text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>
            <div className="flex">
              <div className="space-y-2 w-1/2 m-1">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute top-3 left-3 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                {formErrors.password && (
                  <p className="text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>

              <div className="space-y-2 w-1/2 m-1">
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <FaKey className="absolute top-3 left-3 text-gray-400" />
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    className="w-full pl-10 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                {formErrors.password_confirmation && (
                  <p className="text-sm text-red-600">
                    {formErrors.password_confirmation}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium">
                Role
              </label>
              <div className="relative">
                <FaUserTag className="absolute top-3 left-3 text-gray-400" />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full pl-10 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select Role</option>
                  {userRoles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              {formErrors.role && (
                <p className="text-sm text-red-600">{formErrors.role}</p>
              )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold rounded-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </Layout>
  );
};

export default RegisterUser;
