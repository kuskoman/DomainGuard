<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="toggleDrawer" />
    <router-link to="/" class="text-decoration-none">
      <v-app-bar-title class="text-white">DomainGuard</v-app-bar-title>
    </router-link>
    <v-spacer></v-spacer>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-bell</v-icon>
          <v-badge v-if="unreadCount > 0" :content="unreadCount" color="error" overlap />
        </v-btn>
      </template>
      <NotificationList />
    </v-menu>

    <template v-if="isLoggedIn">
      <v-btn to="/user/profile">Profile</v-btn>
      <v-btn @click="logout">Logout</v-btn>
    </template>
    <template v-else>
      <v-btn to="/user/register">Register</v-btn>
      <v-btn to="/user/login">Login</v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useNotificationsStore } from "@/stores/notifications";
import router from "@/router";

defineProps<{ toggleDrawer: (enabled: boolean) => void }>();

const userStore = useUserStore();
const notificationStore = useNotificationsStore();
notificationStore.connectWebSocket();

const isLoggedIn = computed(() => !!userStore.accessToken);
const unreadCount = computed(() => notificationStore.unreadCount);

const logout = async () => {
  userStore.logout();
  await router.push({ name: "/" });
};
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}

.text-white {
  color: white !important;
}
</style>
