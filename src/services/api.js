import axios from 'axios'
import router from '../router'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // Obrigatório para Cookies HttpOnly
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
})

// Interceptor de requisiçǜo para adicionar o Bearer token
// Garante o funcionamento em mobile/cross-site (contorna bloqueio de cookies de terceiros)
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const token = authStore.user?.token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  },
)

export default api
