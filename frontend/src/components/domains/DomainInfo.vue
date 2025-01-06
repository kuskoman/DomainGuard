<template>
  <div>
    <div class="mb-4">
      <strong>Expiration Date: </strong>
      <FormattedDate :date="domain.expirationDate" v-if="domain.expirationDate" />
      <span v-else>N/A</span>
    </div>
    <div class="mb-4">
      <strong>Last Checked: </strong>
      <FormattedDate :date="domain.lastCheckedAt" v-if="domain.lastCheckedAt" />
      <span v-else>N/A</span>
    </div>
    <div class="mb-4">
      <strong>Renewal Date: </strong>
      <FormattedDate :date="domain.renewalDate" v-if="domain.renewalDate" />
      <span v-else>N/A</span>
    </div>
    <div class="mb-4">
      <strong>Guard Created At: </strong>
      <FormattedDate :date="domain.createdAt" />
    </div>
    <div class="mb-4">
      <strong>Guard Updated At: </strong>
      <FormattedDate :date="domain.updatedAt" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Domain } from "@/api/interfaces/domains.responses";

defineProps<{
  domain: Domain;
}>();
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
