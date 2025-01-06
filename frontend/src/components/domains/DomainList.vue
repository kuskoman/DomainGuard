<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" lg="4" v-for="domain in domains" :key="domain.id">
        <DomainCard :domain="domain" />
      </v-col>
    </v-row>
    <v-card-text v-if="loading">
      <v-progress-circular indeterminate color="primary" />
      Loading domains...
    </v-card-text>
    <v-alert type="info" v-else-if="domains.length === 0">No domains found.</v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiClient } from "@/api/client";
import { AlertType, useAlertStore } from "@/stores/alerts";
import type { Domain } from "@/api/interfaces/domains.responses";

const domains = ref<Domain[]>([]);
const loading = ref(false);
const alertsStore = useAlertStore();

const fetchDomains = async () => {
  loading.value = true;
  try {
    const { data } = await apiClient.get("/domains");
    domains.value = data;
  } catch (error) {
    alertsStore.addAlert(AlertType.Error, "Failed to fetch domains.");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDomains);
</script>
