import apiClient from "src/apiClient";

export const aiPomptGenerator = async(data) =>{
    try {
      const response = await apiClient.post(`/prompt/generate-prompt`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  };


  export const productList = async(data) =>{
    try {
      const response = await apiClient.post(`/prompt/product-list`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  export const productResearch = async(data) =>{
    try {
      const response = await apiClient.post(`/prompt/research`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  };



  export const listPrompts = async(data) =>{
    try {
      const response = await apiClient.post(`/prompt/get-prompts`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  };


  export const updatePrompts = async(data) =>{
    try {
      const response = await apiClient.post(`/prompt/update-prompt`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  };
