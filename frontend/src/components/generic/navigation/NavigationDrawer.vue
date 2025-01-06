<template>
  <v-navigation-drawer :model-value="drawer" @update:model-value="toggleDrawer" app temporary>
    <v-list>
      <template v-if="isLoggedIn">
        <v-list-item to="/domains" link>
          <v-list-item-title>Domains</v-list-item-title>
        </v-list-item>
        <v-list-item to="/domains/add" link>
          <v-list-item-title>Add Domain</v-list-item-title>
        </v-list-item>
        <v-list-item to="/user/profile" link>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item to="/notifications" link>
          <v-list-item-title>Notifications</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout" link>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item to="/user/login" link>
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>
        <v-list-item to="/user/register" link>
          <v-list-item-title>Register</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/user";

const props = defineProps<{ drawer: boolean }>();
const emit = defineEmits(["update:drawer"]);

const userStore = useUserStore();

const isLoggedIn = computed(() => !!userStore.accessToken);

const toggleDrawer = () => {
  emit("update:drawer", !props.drawer);
};

const closeDrawer = () => {
  emit("update:drawer", false);
};

const logout = () => {
  userStore.logout();
  closeDrawer();
};
</script>

<style scoped>
.v-list-item {
  display: flex;
  align-items: center;
}
</style>
