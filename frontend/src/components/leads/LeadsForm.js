import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { addLeadApi } from "../../api/leadsApi";

const LeadForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill all fields before submitting.");
      return;
    }

    setIsSubmitting(true); // Start the loading process

    try {
      const response = await addLeadApi(formData);
      if (response.status === "success") {
        // Clear form and show success
        onSave(formData);
        toast.success(response.message);
        setFormData({
          name: "",
          email: "",
          phone: "",
        });
      } else {
        // Handle the case where the API doesn't return a success status
        toast.error(
          response.message || "Something went wrong, please try again."
        );
      }
    } catch (error) {
      console.log(error)
      // Handle network or API errors
      toast.error(error.message || "Something went wrong... Please try again.");
    } finally {
      setIsSubmitting(false); // End the loading process
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-8 max-w-lg mx-auto space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800">Add New Lead</h2>

      {/* Name Field */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 ease-in-out"
          placeholder="Enter lead name"
          required
        />
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 ease-in-out"
          placeholder="Enter lead email"
          required
        />
      </div>

      {/* Phone Field */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 ease-in-out"
          placeholder="Enter lead phone number"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-emerald-600 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 ease-in-out"
        >
          {isSubmitting ? "Saving..." : "Save Lead"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto bg-red-500 hover:bg-gradient-to-r hover:from-red-400 hover:to-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 ease-in-out"
        >
          Cancel
        </button>
      </div>
      <ToastContainer />
    </form>
  );
};

export default LeadForm;
