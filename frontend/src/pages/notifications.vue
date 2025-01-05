<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="p-4">
          <v-card-title>
            All Notifications
            <v-spacer />
            <v-btn color="primary" :disabled="allRead" @click="markAllAsRead"> Mark All as Read </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="notification in notifications"
                :key="notification.id"
                :class="{ 'v-list-item--disabled': notification.status === 'READ' }"
                :clickable="notification.status === 'UNREAD'"
                @click="notification.status === 'UNREAD' && markAsRead(notification.id)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ notification.message }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <FormattedDate :date="notification.createdAt" />
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon :color="notification.status === 'UNREAD' ? 'primary' : 'grey'"> mdi-bell </v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useNotificationsStore } from "@/stores/notifications";
import { computed, onMounted } from "vue";

const notificationsStore = useNotificationsStore();
const notifications = computed(() => notificationsStore.notifications);

const allRead = computed(() => notificationsStore.unreadCount === 0);

const markAsRead = async (id: number) => {
  await notificationsStore.markAsRead(id);
};

const markAllAsRead = async () => {
  await notificationsStore.markAllAsRead();
};

onMounted(async () => {
  await notificationsStore.fetchAllNotifications();
});
</script>

<style scoped>
.v-list-item--disabled {
  pointer-events: none;
  opacity: 0.6;
}
</style>
