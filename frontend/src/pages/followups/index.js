import React, { useState, useEffect } from "react";
import { getFollowupsApi } from "../../api/followUpApis";
import Layout from "../Home/Home";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import FollowUpModal from "../../components/followups/FollowUpModal";

function Followups() {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null); // Track selected follow-up
  const [showModal, setShowModal] = useState(false); // Track modal visibility

  const fetchFollowups = async () => {
    try {
      const response = await getFollowupsApi();
      setFollowups(response.follow_ups);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  // Format the followup data for the calendar
  const formattedEvents = followups?.map((followup) => ({
    id: followup.id,
    title: `${followup.lead.name} - ${followup.notes}`, // Title includes lead name and notes
    start: moment(followup.scheduled_at).toDate(),
    end: moment(followup.scheduled_at).add(1, "hour").toDate(), // Assuming each follow-up lasts an hour
    description: followup.notes,
    leadId: followup.lead.id,
    leadDetails: followup.lead,
    status: followup.status, // Include status for color coding
  }));

  // Define color mapping based on the status
  const statusColorMapping = {
   
    Completed: "green", // Green for completed follow-ups
    Missed: "red", // Red for missed follow-ups
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedFollowUp(null);
  };

  // Handle follow-up update
  const handleFollowUpUpdate = async (updatedFollowUp) => {
    try {
      // Call API to update the follow-up (you need to implement updateFollowUpApi)
      // const response = await updateFollowUpApi(updatedFollowUp.id, updatedFollowUp);
      console.log("Updated follow-up: ", updatedFollowUp);
      // Optionally update state here
      fetchFollowups(); // Refresh the follow-ups after the update
      handleModalClose();
    } catch (error) {
      console.log("Error updating follow-up: ", error);
    }
  };

  
  // Custom event styling based on status
  const eventStyleGetter = (event) => {
    const status = event.status || "Pending"; // Default to 'Pending' if no status
    const color = statusColorMapping[status] || "gray"; // Default to gray if status not found

    return {
      style: {
        backgroundColor: color, // Apply the color based on status
        borderRadius: "5px",
        color: "white", // Ensure the text is readable
        opacity: 0.8, // Set opacity if needed
      },
    };
  };

  return (
    <Layout>
      <div className="p-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ height: 500 }}>
            <Calendar
              localizer={momentLocalizer(moment)}
              events={formattedEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              onSelectEvent={(event) => {
                setSelectedFollowUp(event); // Set selected follow-up
                setShowModal(true); // Open modal
              }}
              onSelectSlot={(slotInfo) =>
                alert(`Selected Slot: ${slotInfo.start}`)
              }
              eventPropGetter={eventStyleGetter} // Apply custom styling to events
            />
          </div>
        )}
      </div>

      {/* Modal for follow-up details */}
      <FollowUpModal
        showModal={showModal}
        followup={selectedFollowUp}
        onClose={handleModalClose}
        onUpdate={handleFollowUpUpdate}
      />
    </Layout>
  );
}

export default Followups;
