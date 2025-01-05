<template>
  <v-card>
    <v-card-title>
      Notifications
      <v-spacer />
      <v-btn color="primary" @click="markAllAsRead" :disabled="unreadCount === 0"> Mark All as Read </v-btn>
    </v-card-title>

    <v-divider />

    <v-list>
      <v-list-item v-for="notification in notifications" :key="notification.id" class="notification-item">
        <v-list-item-avatar>
          <v-icon :color="getIconColor(notification.topic)">
            {{ getIcon(notification.topic) }}
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ notification.message }}</v-list-item-title>
          <v-list-item-subtitle>
            <FormattedDate :date="notification.createdAt" />
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn icon color="error" @click="markAsRead(notification.id)" v-if="notification.status === 'UNREAD'">
            <v-icon>mdi-check-circle-outline</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-card-text v-if="notifications.length === 0" class="text-center">
      <v-alert type="info">No notifications available.</v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useNotificationStore } from "@/stores/notifications";

const notificationStore = useNotificationStore();

const notifications = computed(() => notificationStore.notifications);
const unreadCount = computed(() => notificationStore.unreadCount);

const markAsRead = (id: number) => {
  notificationStore.markAsRead(id);
};

const markAllAsRead = () => {
  notificationStore.markAllAsRead();
};

const getIcon = (topic: string) => {
  switch (topic) {
    case "DOMAIN_EXPIRATION":
      return "mdi-alert-circle-outline";
    case "SSL_EXPIRATION":
      return "mdi-lock-alert-outline";
    default:
      return "mdi-bell-outline";
  }
};

const getIconColor = (topic: string) => {
  switch (topic) {
    case "DOMAIN_EXPIRATION":
      return "warning";
    case "SSL_EXPIRATION":
      return "error";
    default:
      return "info";
  }
};
</script>

<style scoped>
.notification-item {
  padding: 8px 16px;
}

.notification-item.unread {
  font-weight: bold;
}
</style>
