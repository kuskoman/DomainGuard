<template>
  <v-card elevation="2" class="p-4 mx-auto" max-width="800">
    <v-card-title>Sessions</v-card-title>
    <v-list>
      <v-list-item v-for="session in sessions" :key="session.sessionId" lines="two">
        <template v-slot:prepend>
          <v-avatar color="primary">
            <v-icon color="white">mdi-laptop</v-icon>
          </v-avatar>
        </template>

        <v-list-item-content>
          <v-list-item-title> <strong>Session ID:</strong> {{ session.sessionId }}</v-list-item-title>
          <v-list-item-subtitle>
            <strong>Created At: </strong><FormattedDate :date="session.createdAt" />
          </v-list-item-subtitle>
        </v-list-item-content>

        <template v-slot:append>
          <v-btn color="error" icon="mdi-delete" variant="text" @click="destroySession(session.sessionId)"></v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-card-text v-if="loading">
      <v-progress-circular indeterminate color="primary" />
      Loading sessions...
    </v-card-text>
    <v-card-text v-else-if="sessions.length === 0">
      <v-alert type="info">No active sessions.</v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiClient } from "@/api/client";
import { AlertType, useAlertStore } from "@/stores/alerts";

interface SessionData {
  sessionId: string;
  createdAt: string;
}

const sessions = ref<SessionData[]>([]);
const loading = ref(false);
const alertsStore = useAlertStore();

const fetchSessions = async () => {
  loading.value = true;
  try {
    const { data } = await apiClient.get<SessionData[]>("/sessions/all");
    sessions.value = data;
  } catch (error) {
    alertsStore.addAlert(AlertType.Error, "Failed to fetch sessions.");
  } finally {
    loading.value = false;
  }
};

const destroySession = async (sessionId: string) => {
  try {
    await apiClient.delete(`/sessions/${sessionId}`);
    sessions.value = sessions.value.filter((session) => session.sessionId !== sessionId);
    alertsStore.addAlert(AlertType.Success, "Session deleted successfully.");
  } catch (error) {
    alertsStore.addAlert(AlertType.Error, "Failed to delete session.");
  }
};

const formatDate = (date: string) => new Date(date).toLocaleString();

onMounted(fetchSessions);
</script>

<style scoped>
.v-list-item {
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.v-avatar {
  width: 40px;
  height: 40px;
}
</style>
