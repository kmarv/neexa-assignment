import React, { useState, useEffect } from "react";
import Layout from "../Home/Home";
import { getleadsApi } from "../../api/leadsApi";
import LeadsTable from "../../components/leads/LeadsTable";
import LeadForm from "../../components/leads/LeadsForm";
import Loader from "../../components/Loader";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const fetchLeads = async () => {
    try {
      const response = await getleadsApi();
      setLeads(response.leads);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleFilter = () => {
    // Logic for filtering leads
    console.log("Filter button clicked");
  };

  const handleAdd = () => {
    setIsAdding(true); // Show the form when "Add" is clicked
  };

  const handleSave = (newLead) => {
    // Save the new lead (for now, we'll just add it to the state)
    // Check if 'leads' is an array before attempting to map/iterate
    const updatedLeads = Array.isArray(leads) ? [...leads, newLead] : [newLead];
    setLeads(updatedLeads); // Update the leads state
    setIsAdding(false); // Return to table view
  };

  const handleCancel = () => {
    setIsAdding(false); // Return to table view without saving
  };

  useEffect(() => {
    fetchLeads();
  }, []);
  useEffect(() => {
    fetchLeads();
  }, [refresh]);

  return (
    <Layout>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <div className="sm:p-0   lg:p-6">
          {isAdding ? (
            <LeadForm
              onSave={handleSave}
              refresh={refresh}
              setRefresh={setRefresh}
              onCancel={handleCancel}
            />
          ) : (
            <LeadsTable
              leads={leads}
              refresh={refresh}
              setRefresh={setRefresh}
              onFilter={handleFilter}
              onAdd={handleAdd}
            />
          )}
        </div>
      )}
    </Layout>
  );
}

export default Leads;
