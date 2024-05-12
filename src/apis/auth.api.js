import apiClient from "src/apiClient";

export const register = async(data) =>{
    try {
      const response = await apiClient.post(`/auth/register`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  };


export const login = async(data) =>{
    try {
      const response = await apiClient.post(`/auth/login`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  };