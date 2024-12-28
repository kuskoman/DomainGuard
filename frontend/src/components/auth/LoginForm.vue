<template>
  <v-form ref="form" v-model="valid" @keydown.enter.prevent="submit">
    <v-text-field v-model="email" label="Email" :rules="[rules.required, rules.email]" required />
    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      :rules="[rules.required]"
      :error="invalidCredentials"
      :error-messages="invalidCredentials ? 'Invalid email or password' : ''"
      required
    />
    <v-btn :disabled="!valid" color="primary" @click="submit">Login</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { apiClient } from "@/api/client";
import type { AuthLoginResponse } from "@/api/interfaces/auth.responses";
import router from "@/router";
import { AlertType, useAlertStore } from "@/stores/alerts";
import { useUserStore } from "@/stores/user";
import { rules } from "@/utils/formUtils";
import { ref, watch } from "vue";
import { AxiosError } from "axios";

const form = ref(null);
const valid = ref(false);
const email = ref("");
const password = ref("");
const invalidCredentials = ref(false);

const alertsStore = useAlertStore();
const userStore = useUserStore();

watch([email, password], () => {
  invalidCredentials.value = false;
});

const submit = async () => {
  invalidCredentials.value = false;
  try {
    const { data } = await apiClient.post<AuthLoginResponse>("/auth/login", {
      email: email.value,
      password: password.value,
    });
    const { accessToken } = data;
    userStore.setAccessToken(accessToken);
    await userStore.fetchUserDetails();
    alertsStore.addAlert(AlertType.Success, "User logged in successfully!");
    router.push({
      name: "/user/profile",
    });
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      invalidCredentials.value = true;
    } else {
      alertsStore.addAlert(AlertType.Error, `Failed to login user: ${(error as Error).message}`);
    }
  }
};
</script>
