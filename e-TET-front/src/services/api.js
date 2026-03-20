import axios from 'axios'

const api = axios.create({
  // URL base da API
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

// Interceptor para capturar o token do localStorage e injetar automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
