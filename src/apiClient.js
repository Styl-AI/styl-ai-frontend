import axios from "axios";
import { SERVER_URL, USER_TOKEN } from "./constants/env.contant";

const apiClient = axios.create({
    baseURL: `${SERVER_URL}/api`,
  });

apiClient.interceptors.request.use(async (request) => {
    const accessToken = localStorage.getItem(USER_TOKEN);  
    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
  
    return request;
  });
  


export default apiClient;