import React, { useState, useEffect } from "react";
import { register, rolesApi } from "../../api/authApi";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
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
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    role: "",
  });

  // Fetch roles from API
  const getRoles = async () => {
    setLoading(true);
    try {
      const response = await rolesApi();
      setLoading(false);
      setUserRoles(response.data.roles);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to load roles.");
      setError("Failed to load roles.");
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  // Validate the form fields
  const validateForm = () => {
    let errors = {};
    const { name, email, password, password_confirmation, role } = formData;

    if (!name) errors.name = "Name is required.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Please enter a valid email address.";
    if (!password) errors.password = "Password is required.";
    if (password !== password_confirmation)
      errors.passwordConfirmation = "Passwords must match.";
    if (!role) errors.role = "Please select a role.";
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

  // Handle real-time validation on blur event
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errors = validateForm();
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errors[name] || "", // Set error if it exists
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFormErrors({});

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

      const response = await register(form); // Send FormData to API
      toast.success(response.message);
      setSuccess("Registration successful! Please log in.");
      setFormData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "", 
      })
      navigate("/");
    } catch (err) {
      setLoading(false);
      if (err && err.errors) {
        // Handle validation errors from the API response
        const apiErrors = err.errors;
        for (const key in apiErrors) {
          if (apiErrors.hasOwnProperty(key)) {
            toast.error(apiErrors[key].join(" "));
          }
          setFormErrors(apiErrors[key].join(" "));
        }
      } else {
        toast.error(err.message || "Something went wrong.");
        setError(err.message || "Something went wrong.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur} // Real-time validation
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
            {formErrors.name && (
              <p className="text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

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
              onBlur={handleBlur} // Real-time validation
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
              onBlur={handleBlur} // Real-time validation
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
            {formErrors.password && (
              <p className="text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleInputChange}
              onBlur={handleBlur} // Real-time validation
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
            {formErrors.passwordConfirmation && (
              <p className="text-sm text-red-600">
                {formErrors.passwordConfirmation}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              onBlur={handleBlur} // Real-time validation
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select Role</option>
              {userRoles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
            {formErrors.role && (
              <p className="text-sm text-red-600">{formErrors.role}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white font-semibold rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/" className="text-emerald-500 hover:underline">
            Login
          </Link>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
