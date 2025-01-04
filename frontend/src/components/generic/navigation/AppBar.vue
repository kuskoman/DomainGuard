<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="toggleDrawer" />
    <router-link to="/" class="text-decoration-none">
      <v-app-bar-title class="text-white">DomainGuard</v-app-bar-title>
    </router-link>
    <v-spacer></v-spacer>
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

defineProps<{ toggleDrawer: (enabled: boolean) => void }>();
const userStore = useUserStore();

const isLoggedIn = computed(() => !!userStore.accessToken);

const logout = () => {
  userStore.logout();
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
