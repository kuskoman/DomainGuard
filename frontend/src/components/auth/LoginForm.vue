<template>
  <v-form ref="form" v-model="valid">
    <v-text-field v-model="email" label="Email" :rules="[rules.required, rules.email]" required />
    <v-text-field v-model="password" label="Password" type="password" :rules="[rules.required]" required />
    <v-btn :disabled="!valid" color="primary" @click="submit">Login</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { apiClient } from "@/api/client";
import type { AuthLoginResponse } from "@/api/interfaces/auth.responses";
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
    const response = await apiClient.post<AuthLoginResponse>("/auth/login", {
      email: email.value,
      password: password.value,
    });
    console.log(response.data); // todo: handle login state
    alertsStore.addAlert(AlertType.Success, "User logged in successfully!");
  } catch (error: unknown) {
    alertsStore.addAlert(AlertType.Error, `Failed to login user: ${(error as Error).message}`);
  }
};
</script>
