// api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // Move this to environment variables in production
  timeout: 10000,
});

apiClient.interceptors.response.use((response) => response);
