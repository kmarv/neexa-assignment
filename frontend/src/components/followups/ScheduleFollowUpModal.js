import React, { useState } from "react";
import {  createFollowUpApi } from "../../api/followUpApis";
import { toast, ToastContainer } from "react-toastify";

const ScheduleFollowUpModal = ({ isOpen, onClose, selectedLead }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true)
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time for the follow-up.");
      setLoading(false)
      return;
    }
    const followUpDetails = {
      scheduled_at: `${selectedDate} ${selectedTime}`,
      notes,
      lead_id: selectedLead?.id
    };

    try {
      // Make API call to create follow-up
      const response = await createFollowUpApi(followUpDetails);
      console.log("Follow-up created:", response);
      setLoading(false)
      // Clear form and close modal
      toast.success(response.message);
      setSelectedDate("");
      setSelectedTime("");
      setNotes("");
      setTimeout(() => {
      onClose();
          
      }, 1000);
    } catch (err) {
      setLoading(false);
      console.error("Error creating follow-up:", err);
       if (err && err.errors) {
         // Handle validation errors from the API response
         const apiErrors = err.errors;
         for (const key in apiErrors) {
           if (apiErrors.hasOwnProperty(key)) {
             toast.error(apiErrors[key].join(" "));
           }
          
         }
       } else {
         toast.error(err.message || "Something went wrong.");
         
       }
    }

    
  };

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Schedule Follow-Up</h2>
        <form onSubmit={handleSubmit}>
          {/* Date Picker */}
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          {/* Time Picker (24-hour format) */}
          <div className="mb-4">
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700"
            >
              Select Time (24-hour format)
            </label>
            <input
              type="time"
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              step="60" // Optional: step set to 60 seconds (1 minute) granularity
            />
          </div>

          {/* Optional Notes */}
          <div className="mb-4">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              rows="3"
              placeholder="Add any notes for the follow-up"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default ScheduleFollowUpModal;
