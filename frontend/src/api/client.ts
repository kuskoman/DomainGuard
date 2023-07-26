import { useUserStore } from '@/stores/user'
import axios from 'axios'

const BASE_URL = 'http://localhost:3000/'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30 * 1000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  async (config) => {
    const userStore = useUserStore()

    if (userStore?.accessToken) {
      config.headers.Authorization = `Bearer ${userStore.accessToken}`
    }

    return config
  },

  (error) => {
    return Promise.reject(error)
  }
)
