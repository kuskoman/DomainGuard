<template>
  <v-card class="mx-auto" max-width="344" title="Create New Domain">
    <v-container>
      <v-text-field
        v-model="domainName"
        color="primary"
        label="Domain Name"
        variant="underlined"
      ></v-text-field>
    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="success" @click="handleCreateDomain"> Create </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createDomain } from '../api/domains'
import { useNotificationStore } from '../stores/notification'

const domainName = ref('')
const notificationStore = useNotificationStore()

const router = useRouter()

const handleCreateDomain = async () => {
  try {
    const response = await createDomain(domainName.value)
    notificationStore.addNotification({
      id: new Date().toISOString(),
      message: `Domain ${response.name} was successfully created`,
      type: 'success'
    })
    router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('An error occurred while creating the domain', error)
    notificationStore.addNotification({
      id: new Date().toISOString(),
      message: 'An error occurred while creating the domain',
      type: 'error'
    })
  }
}
</script>
