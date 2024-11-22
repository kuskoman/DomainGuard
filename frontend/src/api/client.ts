import axios from "axios";

export const apiClient = axios.create({
  // todo: move to env
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
});

apiClient.interceptors.request.use(
  // todo: handle errors
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
