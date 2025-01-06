import { connectWebSocket, disconnectWebSocket } from "@/api/websocket";
import { defineStore } from "pinia";
import { apiClient } from "@/api/client";
import { useUserStore } from "./user";

export type NotificationTopic = "DOMAIN_EXPIRATION" | "SSL_EXPIRATION";
export type NotificationStatus = "UNREAD" | "READ";

export interface Notification {
  id: number;
  message: string;
  topic: NotificationTopic;
  status: NotificationStatus;
  createdAt: Date;
}

export interface NotificationIncomingData extends Omit<Notification, "createdAt"> {
  createdAt: string;
}

const serializeNotification = (notification: NotificationIncomingData) => {
  return {
    ...notification,
    createdAt: new Date(notification.createdAt),
  };
};

const sortNotifications = (a: Notification, b: Notification) => {
  return b.createdAt.getTime() - a.createdAt.getTime();
};

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    notifications: [] as Notification[],
    websocketConnected: false,
  }),
  getters: {
    unreadNotifications(state): Notification[] {
      return state.notifications.filter((notification) => {
        return notification.status === "UNREAD";
      });
    },
    unreadCount(state): number {
      return state.notifications.filter((notification) => {
        return notification.status === "UNREAD";
      }).length;
    },
  },
  actions: {
    async fetchUnreadNotifications() {
      const { data } = await apiClient.get<NotificationIncomingData[]>("/notifications/unread");

      this.notifications = [...this.notifications, ...data.map(serializeNotification)].sort(sortNotifications);
    },
    async fetchAllNotifications() {
      const { data } = await apiClient.get<NotificationIncomingData[]>("/notifications");

      this.notifications = data.map(serializeNotification).sort(sortNotifications);
    },
    connectWebSocket() {
      if (this.websocketConnected) {
        return;
      }

      const userStore = useUserStore();
      const accessToken = userStore.accessToken;

      if (!accessToken) {
        return;
      }

      connectWebSocket(accessToken, (data: NotificationIncomingData) => {
        this.handleIncomingNotification(data);
      });

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
      const existingNotification = this.notifications.find((n) => {
        return n.id === data.id;
      });

      if (existingNotification) {
        return;
      }

      const parsedNotification = serializeNotification(data);

      this.notifications = [...this.notifications, parsedNotification].sort(sortNotifications);
    },
    async markAsRead(notificationId: number) {
      await apiClient.patch(`/notifications/${notificationId}/read`);

      const notification = this.notifications.find((n) => {
        return n.id === notificationId;
      });

      if (notification) {
        notification.status = "READ";
      }
    },
    async markAllAsRead() {
      await apiClient.patch("/notifications/read-all");

      this.notifications.forEach((n) => {
        n.status = "READ";
      });
    },
    clearNotifications() {
      this.notifications = [];
    },
  },
});
