import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/authService'
import { persistence } from '../utils/persistence'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(persistence.load('user') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  const login = async (cpf, senha) => {
    loading.value = true
    error.value = null
    try {
      const data = await authService.login(cpf, senha)
      // O access_token é configurado via Set-Cookie pelo backend
      user.value = { id: data.id, cpf: data.cpf }
      persistence.save('user', user.value)
      return true
    } catch (err) {
      error.value =
        err.response?.data?.message || 'Erro ao realizar login. Verifique suas credenciais.'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    persistence.clearAll()
  }

  return { user, loading, error, isAuthenticated, login, logout }
})
