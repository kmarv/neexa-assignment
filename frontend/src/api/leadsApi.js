import api from "./api";

export const getleadsApi = async () => {
    try {
        const response = await api.get("/leads");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const getLeadAPi = async (id) => {
    try {        
        const response = await api.get(`/leads/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const addLeadApi = async (lead) => {
    try {
        const response = await api.post("/leads", lead);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const deleteLeadApi = async (id) => {
  try {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateLeadApi = async (id, lead) => {
  try {
    const response = await api.put(`/leads/${id}`, lead);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchNotificationsApi = async () => {
  try {
    const response = await api.get("/notifications");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const markNotificationAsReadApi = async (notificationId) => {
  try {
    const response = await api.post(
      `/notifications/${notificationId}/mark-as-read`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const markAllNotificationsAsReadApi = async () => {
  try {
    const response = await api.post(`/notifications/mark-all-as-read`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}