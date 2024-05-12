import apiClient from "src/apiClient";

export const usersList = async(data) =>{
    try {
      const response = await apiClient.post(`/users/users-list`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  };


  export const getCurrentUser = async(data) => {
    try {
      const response = await apiClient.post(`/users/currentUser`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  };