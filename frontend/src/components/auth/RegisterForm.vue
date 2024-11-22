<template>
  <v-form ref="form" v-model="valid">
    <v-text-field v-model="email" label="Email" :rules="[rules.required, rules.email]" required />
    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      :rules="[rules.required, rules.minLength]"
      required
    />
    <v-btn :disabled="!valid" @click="submit">Register</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { apiClient } from "@/api/client";
import { AlertType, useAlertStore } from "@/stores/alerts";
import { rules } from "@/utils/formUtils";
import { ref } from "vue";

const form = ref(null);
const valid = ref(false);
const email = ref("");
const password = ref("");

const alertsStore = useAlertStore();

const submit = async () => {
  try {
    const response = await apiClient.post("/register", { email: email.value, password: password.value });
    console.log(response.data);
    alertsStore.addAlert(AlertType.Success, "User registered successfully!");
  } catch (error: unknown) {
    alertsStore.addAlert(AlertType.Error, `Failed to register user: ${(error as Error).message}`);
  }
};
</script>
