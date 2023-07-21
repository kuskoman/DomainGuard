import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api/'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30 * 1000,
  headers: {
    'Content-Type': 'application/json'
  }
})
