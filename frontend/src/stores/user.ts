import { defineStore } from "pinia";
import { apiClient } from "@/api/client";
import type { UserDetailsResponse } from "@/api/interfaces/users.responses";
import { useAlertStore, AlertType } from "@/stores/alerts";
import axios from "axios";

interface UserStoreState {
  accessToken: string;
  userDetails: UserDetailsResponse | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserStoreState => ({
    accessToken: localStorage.getItem("accessToken") || "",
    userDetails: null,
  }),
  actions: {
    setAccessToken(token: string) {
      this.accessToken = token;
      localStorage.setItem("accessToken", token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
    logout() {
      // todo: handle session invalidation on the server
      this.accessToken = "";
      this.userDetails = null;
      localStorage.removeItem("accessToken");
      delete apiClient.defaults.headers.common["Authorization"];
    },
    async fetchUserDetails() {
      const alertStore = useAlertStore();
      try {
        const response = await apiClient.get<UserDetailsResponse>("/users/me");
        this.userDetails = response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          this.logout();
        }

        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        alertStore.addAlert(AlertType.Error, `Failed to fetch user details: ${errorMessage}`);
      }
    },
  },
});
