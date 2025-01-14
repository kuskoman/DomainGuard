<template>
  <v-container class="py-4">
    <v-card class="mx-auto" max-width="600" elevation="2">
      <v-card-title> SSL Certificate Details </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div class="mb-4"><strong>Hostname:</strong> {{ certificate?.hostname || "Loading..." }}</div>
        <div class="mb-4">
          <strong>Expiration Date: </strong>
          <FormattedDate v-if="certificate?.expirationDate" :date="certificate.expirationDate" />
          <span v-else>N/A</span>
        </div>
        <div class="mb-4">
          <strong>Last Checked: </strong>
          <FormattedDate v-if="certificate?.lastCheckedAt" :date="certificate.lastCheckedAt" />
          <span v-else>N/A</span>
        </div>
        <div class="mb-4">
          <strong>Created At: </strong>
          <FormattedDate :date="certificate.createdAt" v-if="certificate?.createdAt" />
          <span v-else>N/A</span>
        </div>
        <div class="mb-4">
          <strong>Updated At: </strong>
          <FormattedDate :date="certificate.updatedAt" v-if="certificate?.updatedAt" />
          <span v-else>N/A</span>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" :loading="loading" @click="refreshCertificate">Refresh Certificate</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { apiClient } from "@/api/client";
import { AlertType, useAlertStore } from "@/stores/alerts";
import FormattedDate from "@/components/generic/FormattedDate.vue";
import type { SslCertificate } from "@/api/interfaces/domains.responses";

const route = useRoute();
const alertsStore = useAlertStore();

interface RouteParams {
  id: string;
}

const certificate = ref<null | SslCertificate>(null);
const loading = ref(false);

const routeParams = route.params as RouteParams;

const fetchCertificate = async () => {
  const certificateId = routeParams.id;
  loading.value = true;
  try {
    const { data } = await apiClient.get<SslCertificate>(`/certificates/${certificateId}`);
    certificate.value = data;
  } catch (error) {
    alertsStore.addAlert(AlertType.Error, "Failed to fetch certificate details.");
  } finally {
    loading.value = false;
  }
};

const refreshCertificate = async () => {
  const certificateId = routeParams.id;
  loading.value = true;
  try {
    await apiClient.post(`/certificates/${certificateId}/refresh`);
    alertsStore.addAlert(AlertType.Success, "Certificate refresh queued.");
  } catch (error) {
    alertsStore.addAlert(AlertType.Error, "Failed to refresh certificate.");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCertificate);
watch(() => routeParams.id, fetchCertificate);
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
