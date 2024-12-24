// api/client.ts
import axios from "axios";
import { useAlertStore, AlertType } from "@/stores/alerts";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // Move this to environment variables in production
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const alertStore = useAlertStore();
    const message = error.response?.data?.message || error.message || "An unknown error occurred.";
    alertStore.addAlert(AlertType.Error, message);
    return Promise.reject(error);
  }
);
