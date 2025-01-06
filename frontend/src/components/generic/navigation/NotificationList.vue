<template>
  <v-card>
    <v-card-title>
      Notifications
      <v-spacer />
      <v-btn color="primary" @click="markAllAsRead" :disabled="unreadCount === 0" class="mx-2">
        Mark All as Read
      </v-btn>
      <v-btn color="secondary" @click="goToNotificationList"> View All </v-btn>
    </v-card-title>

    <v-divider />

    <v-list>
      <v-list-item
        v-for="notification in unreadNotifications"
        :key="notification.id"
        class="notification-item"
        @click="markAsRead(notification.id)"
      >
        <v-list-item-avatar>
          <v-icon :color="notificationTypeMap[notification.topic]?.color || 'info'">
            {{ notificationTypeMap[notification.topic]?.icon || "mdi-bell-outline" }}
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ notification.message }}</v-list-item-title>
          <v-list-item-subtitle>
            <FormattedDate :date="notification.createdAt" />
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-card-text v-if="unreadNotifications.length === 0" class="text-center">
      <v-alert type="info" dismissible> No notifications available. </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useNotificationsStore } from "@/stores/notifications";
import { useRouter } from "vue-router";

const notificationStore = useNotificationsStore();
notificationStore.connectWebSocket();

const router = useRouter();

const unreadNotifications = computed(() => notificationStore.unreadNotifications);
const unreadCount = computed(() => notificationStore.unreadCount);

const markAsRead = async (id: number) => {
  await notificationStore.markAsRead(id);
};

const markAllAsRead = async () => {
  await notificationStore.markAllAsRead();
};

const goToNotificationList = () => {
  router.push("/notifications");
};

const notificationTypeMap = {
  DOMAIN_EXPIRATION: {
    icon: "mdi-alert-circle-outline",
    color: "warning",
  },
  SSL_EXPIRATION: {
    icon: "mdi-lock-alert-outline",
    color: "error",
  },
} as const;
</script>

<style scoped lang="scss">
.notification-item {
  padding: 8px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.v-btn {
  margin-left: 8px;
}
</style>
