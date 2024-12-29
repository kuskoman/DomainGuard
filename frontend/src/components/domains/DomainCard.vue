<template>
  <v-card class="mb-4">
    <v-card-title>
      {{ domain.name }}
      <v-spacer />
      <v-btn icon color="primary" :loading="loading" @click="refreshDomain" class="ml-2">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <div><strong>Expiration Date: </strong> {{ formatDate(domain.expirationDate) }}</div>
      <div><strong>Last Checked: </strong> {{ formatDate(domain.lastCheckedAt) }}</div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { apiClient } from "@/api/client";
import { AlertType, useAlertStore } from "@/stores/alerts";

const props = defineProps({
  domain: {
    type: Object,
    required: true,
  },
});

const alertsStore = useAlertStore();
const loading = ref(false);

const refreshDomain = async () => {
  loading.value = true;
  try {
    const response = await apiClient.post(`/domains/${props.domain.id}/refresh`);
    props.domain.expirationDate = response.data.expirationDate;
    props.domain.lastCheckedAt = response.data.lastCheckedAt;
  } catch (error) {
    alertsStore.addAlert(AlertType.Error, "Failed to refresh domain.");
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: Date) => (date ? new Date(date).toLocaleString() : "N/A");
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}
</style>
