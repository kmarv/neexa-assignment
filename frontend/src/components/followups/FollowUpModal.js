import React, { useContext } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { updateFollowStatusApi } from "../../api/followUpApis";
import useRole from "../../hooks/useRole";
import useHasPermission from "../../hooks/useHasPermission";
import { AuthContext } from "../../contexts/AuthContext";

const FollowUpModal = ({ showModal, followup, onClose }) => {
  const {user} = useContext(AuthContext)
  const isAdmin = useRole("Admin");
  const isSalesManager = useRole("Sales Manager");

  const [status, setStatus] = React.useState(followup?.status);

  const canUpdateFollowupStatus = useHasPermission(
    user.roles[0],
    "update followup status"
  );

  const updateFollowupStatus = async () => {
    try {
      const response = await updateFollowStatusApi(followup.id, status);
      toast.success(response.message);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to update status.");
    }
  };

  if (!followup || !showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Follow-up
        </h2>
        <div className="space-y-4">
          {/* Lead Details */}
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Lead Name:</span>
            <span className="text-gray-900">
              {followup.leadDetails?.name || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Lead Email:</span>
            <span className="text-gray-900">
              {followup.leadDetails?.email || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Lead Phone:</span>
            <span className="text-gray-900">
              {followup.leadDetails?.phone || "N/A"}
            </span>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {canUpdateFollowupStatus ? " Update Status" : "Status"}
            </label>
            {canUpdateFollowupStatus ? (
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Missed">Missed</option>
              </select>
            ) : (
              <span className="block text-gray-900 mt-1">
                {followup.status}
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          {canUpdateFollowupStatus && (
            <button
              onClick={updateFollowupStatus}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal;
