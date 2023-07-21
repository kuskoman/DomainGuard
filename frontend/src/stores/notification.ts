import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])

  function addNotification(notification: Notification) {
    notifications.value.push(notification)
  }

  function removeNotification(id: string) {
    notifications.value = notifications.value.filter((notification) => notification.id !== id)
  }

  return { notifications, addNotification, removeNotification }
})
