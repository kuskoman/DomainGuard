<template>
  <div>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <template v-if="isLoggedIn">
          <v-list-item to="/domains" link>
            <v-list-item-icon>
              <v-icon>mdi-dns</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Domains</v-list-item-title>
          </v-list-item>
          <v-list-item to="/domains/add" link>
            <v-list-item-icon>
              <v-icon>mdi-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Add Domain</v-list-item-title>
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item to="/user/login" link>
            <v-list-item-icon>
              <v-icon>mdi-login</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>
          <v-list-item to="/user/register" link>
            <v-list-item-icon>
              <v-icon>mdi-account-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Register</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";

const drawer = ref(false);
const userStore = useUserStore();

const isLoggedIn = computed(() => !!userStore.accessToken);

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

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
