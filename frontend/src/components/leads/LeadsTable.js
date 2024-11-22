import React, { useContext, useState } from "react";
import { deleteLeadApi } from "../../api/leadsApi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ScheduleFollowUpModal from "../followups/ScheduleFollowUpModal";
import useHasPermission from "../../hooks/useHasPermission";
import { AuthContext } from "../../contexts/AuthContext";
import UpdateLeadModal from "./UpdateLeadModal";

const LeadsTable = ({ leads, onFilter, onAdd, refresh, setRefresh }) => {
  const { user } = useContext(AuthContext);
  console.log(user.roles[0].name);
  const [modalOpen, setModalOpen] = useState(false); // To control modal visibility
  const [selectedLead, setSelectedLead] = useState(null); // Store selected lead for modal
  const [searchQuery, setSearchQuery] = useState("");
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  const canUserViewLeads = useHasPermission(user.roles[0], "view leads");
  const canAddLeads = useHasPermission(user.roles[0], "create leads");
  const canScheduleFollowUp = useHasPermission(
    user.roles[0],
    "schedule followups"
  );

  const openUpdateModal = (lead) => {
    setModalOpen(true);
    setSelectedLead(lead);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedLead(null);
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
    <div className="p-4  max-w-screen overflow-x-hidden mx-auto">
      {/* Filter and Add Buttons */}
      <div className="flex justify-between items-center mb-4 space-y-2 sm:space-y-0">
        {canAddLeads && (
          <button
            className="bg-white border border-emerald-500 text-emerald-500 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-emerald-600 hover:text-white font-bold py-2 px-4 rounded"
            onClick={onAdd}
          >
            Add Lead
          </button>
        )}
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className="bg-white text-blue-500 font-bold py-2 px-4 rounded border border-blue-500 "
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onFilter();
            }
          }}
        />
      </div>

      {/* Leads Table */}
      <div className="relative overflow-auto shadow-md rounded-lg">
        {canUserViewLeads && (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 sticky right-0 bg-gray-50 dark:bg-gray-700"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads && filteredLeads.length > 0 ? (
                filteredLeads.map((lead, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4">{lead.email}</td>
                    <td className="px-6 py-4">{lead.phone}</td>
                    <td className="px-6 py-4 sticky right-0 bg-white dark:bg-gray-800">
                      <div className="flex flex-col md:flex-row items-start md:items-center  gap-2">
                        {lead.is_followup_scheduled ? (
                          <span className="text-green-600">
                            Followup Scheduled
                          </span>
                        ) : canScheduleFollowUp ? (
                          <span
                            className="text-blue-600 hover:underline cursor-pointer dark:text-blue-400 hover:border hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-500 hover:via-blue-700 hover:to-blue-900  font-bold  rounded "
                            onClick={() => handleScheduleFollowUp(lead)}
                          >
                            <span className="absolute inset-0 bg-blue-200 opacity-50 rounded-full animate-pulse-indicator"></span>
                            <span className="relative z-10">
                              Schedule Followup
                            </span>
                          </span>
                        ) : (
                          "No action permiited"
                        )}

                        <span
                          className=" text-red-600  text-left hover:underline cursor-pointer"
                          onClick={() => openUpdateModal(lead)}
                        >
                          Update info
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">
                    No leads available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Schedule Follow-Up Modal */}
      <ScheduleFollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={closeFollowUpModal}
        selectedLead={selectedLead}
      />
      <UpdateLeadModal
        open={modalOpen}
        lead={selectedLead}
        closeModal={closeModal}
        refresh={refresh}
        setRefresh={setRefresh}
      />

      {/* Modal */}
    </div>
  );
};

export default LeadsTable;
