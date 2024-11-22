<template>
  <v-container>
    <v-alert v-for="alert in alerts" :key="alert.id" :type="alert.type" prominent elevation="2" class="mb-3">
      {{ alert.message }}
      <template #append>
        <v-btn icon @click="removeAlert(alert.id)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAlertStore } from "@/stores/alerts";

const alertStore = useAlertStore();
const alerts = computed(() => alertStore.alerts);
const removeAlert = (id: number) => alertStore.removeAlert(id);
</script>

<style scoped lang="scss">
.v-alert {
  max-width: 500px;
}
</style>
