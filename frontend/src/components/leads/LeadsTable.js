import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { deleteLeadApi, updateLeadApi } from "../../api/leadsApi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { LuView } from "react-icons/lu";
import ScheduleFollowUpModal from "../followups/ScheduleFollowUpModal";

const LeadsTable = ({
  leads,
  onFilter,
  onAdd,
  refresh,
  setRefresh
}) => {
  const [modalOpen, setModalOpen] = useState(false); // To control modal visibility
  const [selectedLead, setSelectedLead] = useState(null); // Store selected lead for modal
  const [updatedLead, setUpdatedLead] = useState(null); // Track form changes
  const [isEditMode, setIsEditMode] = useState(false); // Track if in edit mode
  const [searchQuery, setSearchQuery] = useState("");
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);


  // Open modal with lead details
  const openModal = (lead) => {
    setSelectedLead(lead);
    setUpdatedLead(lead); // Initialize the form with lead details
    setIsEditMode(false); // Start in "view" mode
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedLead(null);
    setUpdatedLead(null); // Clear updatedLead when closing modal
  };

  // Handle form changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedLead((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (update lead)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateLeadApi(selectedLead.id, updatedLead);
      toast.success(response.message);
      setRefresh(refresh);

      setTimeout(() => {
        closeModal(); // Close modal after updating
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Something went wrong, please try again.");
    }
  };

  // Handle delete action
  // Handle delete action with SweetAlert confirmation
  const handleDelete = async () => {
    // SweetAlert confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteLeadApi(selectedLead.id);
        toast.success(response.message);
        setRefresh(refresh);
        closeModal();
      } catch (error) {
        toast.error(error.message || "Something went wrong, please try again.");
      }
    }
  };

  // Handle schedule follow-up action
  const handleScheduleFollowUp = (lead) => {
    closeModal();
    openFollowUpModal();
    setSelectedLead(lead);

  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // filter leads based on search query
  const filteredLeads = searchQuery
    ? leads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phone.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : leads;

  // Open follow-up modal
  const openFollowUpModal = () => {
    setIsFollowUpModalOpen(true);
  };

  // Close follow-up modal
  const closeFollowUpModal = () => {
    setIsFollowUpModalOpen(false);
  };

  

  return (
    <div className="p-4">
      {/* Filter and Add Buttons */}
      <div className="flex justify-evenly items-center mb-4">
        <button
          className="bg-white border border-emerald-500 text-emerald-500 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-emerald-600 hover:text-white font-bold py-2 px-4 rounded"
          onClick={onAdd}
        >
          Add Lead
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className="bg-white text-blue-500   font-bold py-2 px-4 rounded border border-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onFilter();
            }
          }}
        />
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads && filteredLeads.length > 0 ? (
              filteredLeads.map((lead, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{lead.name}</td>
                  <td className="py-2 px-4">{lead.email}</td>
                  <td className="py-2 px-4">{lead.phone}</td>
                  <td className="py-2 px-4">
                    <span
                      className="text-gray-700 hover:text-gray-900 focus:outline-none flex items-center"
                      onClick={() => openModal(lead)} // Open modal with lead details
                    >
                      <LuView size={20} /> View
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center">
                  No leads available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Schedule Follow-Up Modal */}
      <ScheduleFollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={closeFollowUpModal}
        selectedLead={selectedLead}
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Lead" : "Lead Details"}
            </h2>
            {/* Display Lead Details or Form */}
            {!isEditMode ? (
              <>
                <div className="mb-4">
                  <p>
                    <strong>Name:</strong> {selectedLead.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedLead.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedLead.phone}
                  </p>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => setIsEditMode(true)} // Switch to edit mode
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={handleDelete} // Delete action
                  >
                    Delete
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    onClick={handleScheduleFollowUp(selectedLead)} // Schedule follow-up action
                  >
                    Schedule Follow-up
                  </button>
                </div>
              </>
            ) : (
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
                    value={updatedLead.name}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
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
                    value={updatedLead.email}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
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
                    value={updatedLead.phone}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal} // Close the modal without saving
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
