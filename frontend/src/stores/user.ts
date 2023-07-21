import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type LoginUserInput, type LoginUserPayload, loginUser } from '@/api/users/login'
import {
  type RegisterUserInput,
  type RegisterUserResponse,
  registerUser
} from '@/api/users/register'
import { useNotificationStore } from './notification'

export const useUserStore = defineStore('user', () => {
  const accessToken = ref<string | null>(null)
  const userEmail = ref<string | null>(null)

  const isLoggedIn = computed(() => accessToken.value !== null)
  const notificationStore = useNotificationStore()

  async function login(input: LoginUserInput) {
    try {
      const response: LoginUserPayload = await loginUser(input)

      if (response && response.access_token) {
        accessToken.value = response.access_token
        userEmail.value = input.email
        notificationStore.addNotification({
          id: new Date().toISOString(),
          message: 'Login successful!',
          type: 'success'
        })
      } else {
        throw new Error('Invalid login response')
      }
    } catch (error) {
      console.error('Login failed', error)
      notificationStore.addNotification({
        id: new Date().toISOString(),
        message: 'Login failed!',
        type: 'error'
      })
    }
  }

  async function register(input: RegisterUserInput): Promise<boolean> {
    try {
      const response: RegisterUserResponse = await registerUser(input)

      if (response && response.email && response.id) {
        notificationStore.addNotification({
          id: new Date().toISOString(),
          message: 'Registration successful!',
          type: 'success'
        })
        return true
      } else {
        throw new Error('Invalid registration response')
      }
    } catch (error) {
      console.error('Registration failed', error)
      notificationStore.addNotification({
        id: new Date().toISOString(),
        message: 'Registration failed!',
        type: 'error'
      })
      return false
    }
  }

  async function logout() {
    accessToken.value = null
    userEmail.value = null
  }

  return { accessToken, userEmail, isLoggedIn, login, logout, register }
})
