<template>
  <v-card>
    <v-card-title class="headline">{{ name }}</v-card-title>
    <v-card-subtitle>Domain ID: {{ id }}</v-card-subtitle>

    <v-card-text>
      <p>User ID: {{ userId }}</p>
      <p>Expiration Date: {{ formatDate(expirationDate) }}</p>
      <p>Last Checked At: {{ formatDate(lastCheckedAt) }}</p>
      <p>Created At: {{ formatDate(createdAt) }}</p>
      <p>Updated At: {{ formatDate(updatedAt) }}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    expirationDate: {
      type: String,
      required: true
    },
    lastCheckedAt: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    },
    updatedAt: {
      type: String,
      required: true
    }
  },
  methods: {
    formatDate(dateString: string) {
      const date = new Date(dateString)
      return date.toLocaleString()
    }
  }
})
</script>
