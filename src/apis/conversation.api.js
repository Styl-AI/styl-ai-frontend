import apiClient from "src/apiClient";

export const listConversationById = async(data) =>{
    try {
      const response = await apiClient.post(`conversations/msg-list`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  };


  export const listConversationByUserId = async(data) =>{
    try {
      const response = await apiClient.post(`conversations/conv-list`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  };


  export const listClickedLinksById = async(data) =>{
    try {
      const response = await apiClient.post(`conversations/links-list`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  };


  