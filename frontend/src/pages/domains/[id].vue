<template>
  <v-container class="py-4">
    <v-card class="mx-auto" max-width="1200" elevation="2">
      <v-card-text>
        <div class="text-h6 font-weight-bold">Domain Details</div>
        <p class="text-h5 font-weight-black">
          {{ domain?.name || "Loading..." }}
        </p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text v-if="domain">
        <DomainInfo :domain="domain" />
        <DomainCertificatesList :certificates="domain.sslCertificates" />
      </v-card-text>
      <v-card-text v-else class="d-flex flex-column align-center py-4">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p class="mt-4">Fetching domain details...</p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" :loading="loading" @click="refreshDomain"> Refresh Domain </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { apiClient } from "@/api/client";
import { AlertType, useAlertStore } from "@/stores/alerts";
import type { Domain } from "@/api/interfaces/domains.responses";

interface RouteParams {
  id: string;
}

const route = useRoute();
const params = route.params as RouteParams;
const domain = ref<null | Domain>(null);
const loading = ref(false);
const alertsStore = useAlertStore();

const fetchDomain = async () => {
  loading.value = true;
  try {
    const { data } = await apiClient.get(`/domains/${params.id}`);
    domain.value = data;
  } catch (error) {
    alertsStore.addAlert(AlertType.Error, "Failed to fetch domain details.");
  } finally {
    loading.value = false;
  }
};

const refreshDomain = async () => {
  loading.value = true;
  try {
    await apiClient.post(`/domains/${params.id}/refresh`);
    alertsStore.addAlert(AlertType.Success, "Domain refresh queued.");
  } catch (error) {
    alertsStore.addAlert(AlertType.Error, "Failed to refresh domain.");
  } finally {
    loading.value = false;
  }
};

watch(
  () => params.id,
  () => fetchDomain(),
  { immediate: true }
);

onMounted(fetchDomain);
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}

.text-h6 {
  margin-bottom: 8px;
}
</style>
