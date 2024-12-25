import { defineStore } from "pinia";
import { apiClient } from "@/api/client";
import type { UserDetailsResponse } from "@/api/interfaces/users.responses";
import { useAlertStore, AlertType } from "@/stores/alerts";
import axios from "axios";

interface UserStoreState {
  email: string;
  accessToken: string;
  userDetails: UserDetailsResponse | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserStoreState => ({
    email: localStorage.getItem("userEmail") || "",
    accessToken: localStorage.getItem("accessToken") || "",
    userDetails: null,
  }),
  actions: {
    setAccessToken(token: string) {
      this.accessToken = token;
      localStorage.setItem("accessToken", token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
    clearAccessToken() {
      this.accessToken = "";
      this.email = "";
      this.userDetails = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userEmail");
      delete apiClient.defaults.headers.common["Authorization"];
    },
    async fetchUserDetails() {
      const alertStore = useAlertStore();
      try {
        const response = await apiClient.get<UserDetailsResponse>("/users/me");
        this.userDetails = response.data;
        this.email = response.data.email;
        localStorage.setItem("userEmail", response.data.email);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          this.clearAccessToken();
        }

        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        alertStore.addAlert(AlertType.Error, `Failed to fetch user details: ${errorMessage}`);
      }
    },
  },
});
