<template>
  <div>
    <v-alert
      v-for="notification in notifications"
      :key="notification.id"
      :color="notification.type"
      :value="true"
      closeable
      @click:close="() => removeNotification(notification.id)"
    >
      {{ notification.message }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import { useNotificationStore } from '@/stores/notification'
import { defineComponent } from 'vue'
import { VAlert } from 'vuetify/components'

export default defineComponent({
  name: 'NotificationBar',

  components: {
    VAlert
  },

  setup() {
    const notificationStore = useNotificationStore()

    return {
      notifications: notificationStore.notifications,
      removeNotification: (id: string) => {
        notificationStore.removeNotification(id)
      }
    }
  }
})
</script>
