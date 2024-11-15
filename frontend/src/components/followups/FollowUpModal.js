import React, { useState, useEffect } from "react";
import moment from "moment";
import { updateFollowStatusApi } from "../../api/followUpApis";
import { toast } from "react-toastify";
import useRole from "../../hooks/useRole";

const FollowUpModal = ({ showModal, followup, onClose }) => {

    const isAdmin = useRole('Admin');
    const isSaleManager = useRole('Sales Manager')

   const [updatedFollowUp, setUpdatedFollowUp] = useState(followup);
  const [isUpdating, setIsUpdating] = useState(false); // To track if the user clicked "Update"
  const [status, setStatus] = useState(followup?.status); // Track the status for dropdown
  //   const [reschuedule, setReschedule] = useState(false); // Track reschedule status

  useEffect(() => {
    setUpdatedFollowUp(followup); // Reset follow-up details when followup prop changes
    setStatus(followup?.status); // Reset the status to the current one
  }, [followup]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFollowUp((prev) => ({ ...prev, [name]: value }));
  };


  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  if (!showModal) return null;

  //   const rescheduleFollowup = () => {
  //     setReschedule(false); // Close reschedule mode
  //   };

  const updateFollowupStatus = async () => {
    try {
      const response = await updateFollowStatusApi(followup.id, status);
      toast.success(response.message);
      setIsUpdating(false);
    } catch (error) {
      toast.error(error.message || "Something went wrong, please try again.");
    }
  };

 
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Follow-up</h2>
        <form>
          {!isUpdating ? (
            <>
              {/* Show lead details in read-only mode */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Lead Name
                </label>
                <input
                  type="text"
                  value={updatedFollowUp?.leadDetails?.name || "N/A"}
                  readOnly
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Scheduled At
                </label>
                <input
                  type="datetime-local"
                  name="scheduled_at"
                  readOnly
                  value={moment(updatedFollowUp?.scheduled_at).format(
                    "YYYY-MM-DDTHH:mm"
                  )}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  readOnly
                  value={updatedFollowUp?.notes}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                ></textarea>
              </div>
            </>
          ) : (
            // Show the status select when isUpdating is true
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={status}
                onChange={handleStatusChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Missed">Missed</option>
              </select>
            </div>
          )}

          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose} // Only close modal when "Cancel" is clicked
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            {isUpdating && (
              <button
                type="button"
                onClick={() => setIsUpdating(true)} // Switch to "update" mode
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Update Status
              </button>
            )}
            {(isAdmin === true || isSaleManager === true) && (
              <button
                type="submit"
                className="bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 text-white px-4 py-2 rounded-md hover:bg-sky-800"
                onClick={updateFollowupStatus}
              >
                Update
              </button>
            )}
            {console.log(isAdmin)}
            {console.log(isSaleManager)}

            {/* Only show the "Reschedule" button when reschuedule is false */}
            {/* {!reschuedule ? (
              <button
                type="button"
                onClick={() => setReschedule(true)} // Switch to reschedule mode without closing modal
                className="bg-gradient-to-r from-red-500 via-red-500 to-red-500 text-white px-4 py-2 rounded-md hover:bg-red-800"
              >
                Reschedule
              </button>
            ) : (
              <button
                type="submit"
                className="bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 text-white px-4 py-2 rounded-md hover:bg-sky-800"
                onClick={() => rescheduleFollowup()} // Save reschedule
              >
                Save
              </button>
            )} */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FollowUpModal;
