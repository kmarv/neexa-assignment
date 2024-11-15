import api from "./api";

export const createFollowUpApi = async (followUpDetails) => {
    try {
        const response = await api.post("/followups", followUpDetails);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getFollowupsApi = async () => {
    try {
        const response = await api.get("/followups");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const updateFollowStatusApi = async (followUpId, status) => {
    try {
        const response = await api.put(`/followups/${followUpId}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }


}

export const rescheduleFollowupApi = async (followUpId, datetime) => {
     try {
       const response = await api.put(`/followups/${followUpId}/reschedule`, {
         datetime,
       });
       return response.data;
     } catch (error) {
       throw error.response.data;
     }
}