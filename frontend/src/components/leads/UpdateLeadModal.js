import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateLeadApi } from "../../api/leadsApi"; 

function UpdateLeadModal({ lead, closeModal, open, refresh, setRefresh }) {
  const [updatedLead, setUpdatedLead] = useState({}); // Initialize state with the lead's details
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedLead((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateLeadApi(lead.id, updatedLead); // Call the update API
      toast.success(response.message || "Lead updated successfully!");
      setRefresh(!refresh); // Trigger refresh
      closeModal(); // Close modal after successful update
    } catch (error) {
      toast.error(error.message || "Failed to update lead. Please try again.");
    }
  };

   useEffect(() => {
     setUpdatedLead({ ...lead });
   }, [lead]);

  // Prevent rendering if modal is not open
  if (!open) return null;

 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update Lead</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={updatedLead.name || ""}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={updatedLead.email || ""}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={updatedLead.phone || ""}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateLeadModal;
