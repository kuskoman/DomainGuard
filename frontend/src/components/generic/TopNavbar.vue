<template>
  <v-app-bar :elevation="2" class="bg-primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>DomainGuard</v-app-bar-title>
    <v-spacer></v-spacer>
    <template v-if="isLoggedIn">
      <v-btn :to="'/profile'">Profile</v-btn>
      <v-btn @click="logout">Logout</v-btn>
    </template>
    <template v-else>
      <v-btn :to="'/user/register'">Register</v-btn>
      <v-btn :to="'/user/login'">Login</v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const isLoggedIn = computed(() => !!userStore.accessToken);

const logout = () => {
  userStore.clearAccessToken();
};
</script>
