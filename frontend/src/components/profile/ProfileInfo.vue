<template>
  <v-card elevation="2" class="p-4">
    <v-card-title>User Information</v-card-title>
    <v-card-text v-if="loading">
      <v-progress-circular indeterminate color="primary" />
      <span class="ml-2">Loading user details...</span>
    </v-card-text>
    <v-card-text v-else-if="error">
      <v-alert type="error" dismissible> Failed to load user details. {{ error }} </v-alert>
    </v-card-text>
    <v-card-text v-else-if="userDetails">
      <div>
        <strong>Email:</strong> {{ userDetails.email }}<br />
        <strong>First Name:</strong> {{ userDetails.firstName || "N/A" }}<br />
        <strong>Last Name:</strong> {{ userDetails.lastName || "N/A" }}
      </div>
    </v-card-text>
    <v-card-text v-else>
      <v-alert type="warning">User details are not available. Please try again later.</v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const userDetails = computed(() => userStore.userDetails);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchUserDetails = async () => {
  loading.value = true;
  error.value = null;
  try {
    await userStore.fetchUserDetails();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "An unknown error occurred";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!userDetails.value) {
    fetchUserDetails();
  }
});
</script>

<style scoped>
.v-card {
  margin-bottom: 1rem;
}
</style>
