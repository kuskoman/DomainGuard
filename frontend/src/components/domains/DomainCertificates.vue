<template>
  <div>
    <div class="text-h6 font-weight-bold mb-4">SSL Certificates</div>
    <v-data-table :items="certificates" :headers="headers" :items-per-page="5" class="elevation-1" dense>
      <template #item.hostname="{ item }">
        <router-link :to="`/certificates/${item.id}`" class="certificate-link text-primary">
          {{ item.hostname }}
        </router-link>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import type { SslCertificate } from "@/api/interfaces/domains.responses";

defineProps<{
  certificates: SslCertificate[];
}>();

const headers = [
  { title: "Hostname", key: "hostname" },
  { title: "Expiration Date", key: "expirationDate" },
  { title: "Last Checked", key: "lastCheckedAt" },
] as const;
</script>

<style scoped>
.text-h6 {
  margin-bottom: 8px;
}

.certificate-link {
  text-decoration: none;
}

.certificate-link:hover {
  text-decoration: underline;
}
</style>
