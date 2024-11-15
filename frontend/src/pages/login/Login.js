import React, { useState, useContext } from "react";
import { login } from "../../api/authApi";
import { AuthContext } from "../../contexts/AuthContext";

const Login = () => {
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: handleLogin } = useContext(AuthContext);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Validation state
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  // Email validation regex pattern
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "", // Reset error message when the user types
    }));
  };

  const validateForm = () => {
    let errors = {};
    if (!isEmailValid) errors.email = "Please enter a valid email address.";
    if (!formData.password) errors.password = "Password is required.";
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorText(""); // Reset error text before submission

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return; // Prevent form submission if there are validation errors
    }

    try {
      // Use FormData to collect form data
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);

      // Submit login request
      const userData = await login(data);
      handleLogin(userData); // Assuming the userData contains the user info
    } catch (error) {
      setErrorText(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-invalid={formErrors.email ? "true" : "false"}
          />
          {formErrors.email && (
            <p style={{ color: "red" }}>{formErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            aria-invalid={formErrors.password ? "true" : "false"}
          />
          {formErrors.password && (
            <p style={{ color: "red" }}>{formErrors.password}</p>
          )}
        </div>

        {errorText && <p style={{ color: "red" }}>{errorText}</p>}

        <button
          type="submit"
          disabled={loading || !isEmailValid || !formData.password}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
