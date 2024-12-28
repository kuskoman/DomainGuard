// api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // Move this to environment variables in production
  timeout: 10000,
});

const accessToken = localStorage.getItem("accessToken");
if (accessToken) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}
