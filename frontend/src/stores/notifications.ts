import { connectWebSocket, disconnectWebSocket } from "@/api/websocket";
import { defineStore } from "pinia";
import { useUserStore } from "./user";

export type NotificationTopic = "DOMAIN_EXPIRATION" | "SSL_EXPIRATION";
export type NotificationStatus = "UNREAD" | "READ";

export interface Notification {
  id: number;
  message: string;
  topic: NotificationTopic;
  status: NotificationStatus;
  createdAt: Date; // Use string for easier parsing in components
}

export interface NotificationIncomingData extends Omit<Notification, "createdAt"> {
  createdAt: string;
}

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    notifications: ((): Notification[] => [])(),
    websocketConnected: false,
  }),
  getters: {
    unreadNotifications(state) {
      return state.notifications.filter((notification) => notification.status === "UNREAD");
    },
    unreadCount(state): number {
      return state.notifications.filter((notification) => notification.status === "UNREAD").length;
    },
  },
  actions: {
    connectWebSocket() {
      if (this.websocketConnected) {
        return;
      }
      const userStore = useUserStore();
      const accessToken = userStore.accessToken;
      if (!accessToken) {
        return;
      }
      connectWebSocket(accessToken, (data) => this.handleIncomingNotification(data));
      this.websocketConnected = true;
    },
    disconnectWebSocket() {
      if (!this.websocketConnected) {
        return;
      }
      disconnectWebSocket();
      this.websocketConnected = false;
    },
    handleIncomingNotification(data: NotificationIncomingData) {
      const existingNotification = this.notifications.find((n) => n.id === data.id);
      if (existingNotification) {
        return;
      }

      const parsedNotification: Notification = {
        ...data,
        createdAt: new Date(data.createdAt),
      };
      this.notifications.unshift(parsedNotification);
    },
    markAsRead(notificationId: number) {
      const notification = this.notifications.find((n) => n.id === notificationId);
      if (notification) {
        notification.status = "READ";
      }
    },
    markAllAsRead() {
      this.notifications.forEach((n) => (n.status = "READ"));
    },
    clearNotifications() {
      this.notifications = [];
    },
  },
});
