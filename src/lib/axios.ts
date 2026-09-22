import axios, { type AxiosError } from 'axios'
import { ENV } from '@/config/env'

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Request interceptor: attach JWT bearer token if user is an authenticated officer
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('officer_access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: global error and 401 Unauthorized handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('officer_access_token')
      // Optional: window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
