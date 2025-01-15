import { defineStore } from "pinia";
import { apiClient } from "@/api/client";
import { useNotificationsStore } from "./notifications";

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
    },
    logout() {
      this.accessToken = "";
      localStorage.removeItem("accessToken");
      delete apiClient.defaults.headers.common["Authorization"];
      const notificationsStore = useNotificationsStore();
      notificationsStore.disconnectWebSocket();
    },
  },
});
