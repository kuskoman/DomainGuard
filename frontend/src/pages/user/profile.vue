<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card elevation="2" class="p-6">
          <v-card-title class="text-h5">Profile</v-card-title>
          <v-card-text v-if="loading">
            <v-progress-circular indeterminate color="primary" />
            <span class="ml-4">Loading your profile...</span>
          </v-card-text>
          <v-card-text v-else-if="userDetails">
            <v-list>
              <v-list-item>
                <v-list-item-title>Email:</v-list-item-title>
                <v-list-item-subtitle>{{ userDetails.email }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="userDetails.firstName || userDetails.lastName">
                <v-list-item-title>Name:</v-list-item-title>
                <v-list-item-subtitle>
                  {{ userDetails.firstName || "N/A" }} {{ userDetails.lastName || "N/A" }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>User ID:</v-list-item-title>
                <v-list-item-subtitle>{{ userDetails.id }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-text v-else>
            <v-alert type="warning">User details are unavailable. Please try again later.</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref, onMounted, computed } from "vue";

const userStore = useUserStore();
const loading = ref(false);

const userDetails = computed(() => userStore.userDetails);

const fetchProfile = async () => {
  loading.value = true;
  try {
    if (!userDetails.value) {
      await userStore.fetchUserDetails();
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}
.v-list-item-title {
  font-weight: bold;
}
</style>
