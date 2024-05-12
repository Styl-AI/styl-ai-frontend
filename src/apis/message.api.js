import apiClient from "src/apiClient";

export const updateMessageCount = async(data) =>{
    try {
      const response = await apiClient.post(`/messages/update-click-count`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  };
