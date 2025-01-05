import axios from "axios";
import { BASE_URL } from "./config";

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
});

const accessToken = localStorage.getItem("accessToken");
if (accessToken) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}
