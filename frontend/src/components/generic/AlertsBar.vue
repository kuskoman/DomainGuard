<template>
  <div class="alerts-bar">
    <v-alert
      v-for="alert in alerts"
      :key="alert.id"
      :type="alert.type"
      prominent
      elevation="2"
      class="full-width"
      closable
      @click:close="() => removeAlert(alert.id)"
    >
      {{ alert.message }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAlertStore } from "@/stores/alerts";

const alertStore = useAlertStore();
const alerts = computed(() => alertStore.alerts);
const removeAlert = (id: number) => alertStore.removeAlert(id);
</script>

<style scoped lang="scss">
.alerts-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.full-width {
  width: 100%;
  margin: 0;
  border-radius: 0;
}

.v-alert v-btn {
  color: inherit;
}

.v-btn {
  margin-left: auto;
}
</style>
