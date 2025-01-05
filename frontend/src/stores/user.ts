import { defineStore } from "pinia";
import { apiClient } from "@/api/client";
import { useNotificationStore } from "./notifications";

export const useUserStore = defineStore("user", {
  state: () => ({
    email: "",
    accessToken: localStorage.getItem("accessToken") || "",
  }),
  actions: {
    setAccessToken(token: string) {
      this.accessToken = token;
      localStorage.setItem("accessToken", token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const notificationStore = useNotificationStore();
      notificationStore.connectWebSocket(token);
    },
    logout() {
      this.accessToken = "";
      localStorage.removeItem("accessToken");
      delete apiClient.defaults.headers.common["Authorization"];

      const notificationStore = useNotificationStore();
      notificationStore.disconnectWebSocket();
    },
  },
});
