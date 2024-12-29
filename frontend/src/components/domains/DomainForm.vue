<template>
  <v-card class="p-4" elevation="2">
    <v-card-title>Add Domain</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="domainName"
          label="Domain Name"
          :rules="[rules.required, rules.domain]"
          placeholder="e.g., www.example.com"
          required
          @blur="cleanDomainName"
        />
        <v-btn :disabled="!valid" color="primary" class="mt-4" @click="submitForm"> Add Domain </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { apiClient } from "@/api/client";
import { AlertType, useAlertStore } from "@/stores/alerts";
import { rules } from "@/utils/formUtils";

const form = ref(null);
const valid = ref(false);
const domainName = ref("");
const alertsStore = useAlertStore();
const router = useRouter();

const cleanDomainName = () => {
  domainName.value = domainName.value.replace(/^[a-zA-Z]+:\/\//, "").replace(/\/.*$/, "");
};

const submitForm = async () => {
  if (!valid.value) return;

  try {
    const response = await apiClient.post("/domains", { name: domainName.value });
    alertsStore.addAlert(AlertType.Success, `Domain ${domainName.value} added successfully.`);
    domainName.value = "";
    router.push(`/domains/${response.data.id}`);
  } catch (error) {
    alertsStore.addAlert(AlertType.Error, `Failed to add domain: ${(error as Error).message}`);
  }
};
</script>

<style scoped>
.v-card {
  max-width: 400px;
  margin: auto;
}
</style>
