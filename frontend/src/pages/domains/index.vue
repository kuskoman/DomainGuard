<template>
  <v-container class="py-4">
    <v-card class="mx-auto" max-width="900" elevation="2">
      <v-card-title>
        <span class="text-h6 font-weight-bold">Domains</span>
        <v-spacer />
        <v-btn color="primary" :loading="loading" @click="fetchDomains" variant="outlined">
          <v-icon left>mdi-refresh</v-icon> Refresh
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text v-if="domains.length > 0">
        <v-data-table :items="domains" :headers="headers" item-value="id" dense>
          <template #item.actions="{ item }">
            <v-btn icon color="primary" @click="navigateToDomain(item.id)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn icon color="error" @click="deleteDomain(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-text v-else-if="loading" class="d-flex justify-center">
        <v-progress-circular indeterminate color="primary" />
      </v-card-text>
      <v-card-text v-else>
        <v-alert type="info" class="mb-0">No domains found.</v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiClient } from "@/api/client";
import { AlertType, useAlertStore } from "@/stores/alerts";
import router from "@/router";
import type { Domain } from "@/api/interfaces/domains.responses";

const domains = ref<Domain[]>([]);
const loading = ref(false);
const alertsStore = useAlertStore();

const headers = [
  { title: "Name", key: "name" },
  { title: "Expiration Date", key: "expirationDate" },
  { title: "Last Checked", key: "lastCheckedAt" },
  { title: "Actions", key: "actions", align: "end", sortable: false },
] as const;

const sortDomains = (a: Domain, b: Domain) => {
  if (a.renewalDate === null && b.renewalDate === null) {
    return 0;
  }

  if (a.renewalDate === null) {
    return 1;
  }

  if (b.renewalDate === null) {
    return -1;
  }

  return a.renewalDate.getTime() - b.renewalDate.getTime();
};

const fetchDomains = async () => {
  loading.value = true;
  try {
    const { data } = await apiClient.get<Domain[]>("/domains");
    const sortedDomains = data.sort(sortDomains);
    domains.value = sortedDomains;
  } catch (error) {
    alertsStore.addAlert(AlertType.Error, "Failed to fetch domains.");
  } finally {
    loading.value = false;
  }
};

const navigateToDomain = async (domainId: string) => {
  await router.push(`/domains/${domainId}`);
};

const deleteDomain = async (domainId: string) => {
  loading.value = true;
  try {
    await apiClient.delete(`/domains/${domainId}`);
    domains.value = domains.value.filter((domain) => domain.id !== domainId);
    alertsStore.addAlert(AlertType.Success, "Domain deleted successfully.");
  } catch (error) {
    alertsStore.addAlert(AlertType.Error, "Failed to delete domain.");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDomains);
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}

.v-btn {
  margin-left: 8px;
}
</style>
