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
    <v-text-field
      v-model="passwordConfirmation"
      label="Confirm Password"
      type="password"
      :rules="[rules.required, confirmPasswordRule]"
      required
    />
    <v-btn :disabled="!valid" color="primary" @click="submit">Register</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { apiClient } from "@/api/client";
import type { UserRegisterResponse } from "@/api/interfaces/users.responses";
import router from "@/router";
import { AlertType, useAlertStore } from "@/stores/alerts";
import { useNotificationsStore } from "@/stores/notifications";
import { useUserStore } from "@/stores/user";
import { rules } from "@/utils/formUtils";
import { ref, computed } from "vue";

const form = ref(null);
const valid = ref(false);
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");

const alertsStore = useAlertStore();
const userStore = useUserStore();
const notificationsStore = useNotificationsStore();

const confirmPasswordRule = computed(() => {
  return (value: string) => value === password.value || "Passwords do not match";
});

const submit = async () => {
  try {
    const { data } = await apiClient.post<UserRegisterResponse>("/users/register", {
      email: email.value,
      password: password.value,
    });
    const { accessToken } = data;
    alertsStore.addAlert(AlertType.Success, "User registered successfully!");
    userStore.setAccessToken(accessToken);
    notificationsStore.connectWebSocket();
    router.push({
      name: "/user/profile",
    });
  } catch (error: unknown) {
    alertsStore.addAlert(AlertType.Error, `Failed to register user: ${(error as Error).message}`);
  }
};
</script>
