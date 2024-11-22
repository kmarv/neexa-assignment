import React, { useState, useEffect } from "react";
import { getFollowupsApi } from "../../api/followUpApis";
import Layout from "../Home/Home";
import moment from "moment";
import { toast } from "react-toastify";
import FollowUpModal from "../../components/followups/FollowUpModal";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Loader from "../../components/Loader";

const localizer = momentLocalizer(moment);

function Followups() {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchFollowups = async () => {
    try {
      const response = await getFollowupsApi();
      setFollowups(response.follow_ups);
    } catch (error) {
      toast.error("Failed to fetch follow-ups. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const formattedEvents = followups.map((followup) => ({
    id: followup.id,
    title: `${followup.lead.name} - Followup meeting`,
    start: moment(followup.scheduled_at).toDate(),
    end: moment(followup.scheduled_at).add(1, "hour").toDate(),
    status: followup.status,
    leadDetails: followup.lead,
  }));

  const statusColorMapping = {
    Completed: "green",
    Missed: "red",
    Pending: "gray",
  };

 const eventStyleGetter = (event) => {
   const baseStyle = {
     backgroundColor: statusColorMapping[event.status] || "gray",
     borderRadius: "5px",
     color: "white",
     position: "relative",
   };

   if (event.status === "Pending" || event.status === "Missed") {
     return {
       style: {
         ...baseStyle,
       },
       className: "relative",
     };
   }

   return {
     style: baseStyle,
   };
 };


  return (
    <Layout>
      <div className="p-4">
        {loading ? (
          <p><Loader /></p>
        ) : (
          <div className="h-[500px]">
            <Calendar
              localizer={localizer}
              events={formattedEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              onSelectEvent={(event) => {
                setSelectedFollowUp(event);
                setShowModal(true);
              }}
              eventPropGetter={eventStyleGetter}
              components={{
                event: ({ event }) => (
                  <div className="flex items-center">
                    {(event.status === "Pending" ||
                      event.status === "Missed") && (
                      <span
                        className="absolute left-0 w-3 h-3 bg-yellow-400 rounded-full animate-pulse-indicator"
                        style={{ marginRight: "0.5rem" }}
                      ></span>
                    )}
                    <span>{event.title}</span>
                  </div>
                ),
              }}
            />
          </div>
        )}
      </div>

      {showModal && (
        <FollowUpModal
          showModal={showModal}
          followup={selectedFollowUp}
          onClose={() => setShowModal(false)}
        />
      )}
    </Layout>
  );
}

export default Followups;
