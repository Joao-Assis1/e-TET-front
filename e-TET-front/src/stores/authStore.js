import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const login = async (usuario, senha) => {
    loading.value = true
    error.value = null
    try {
      const data = await authService.login(usuario, senha)
      // Salva o token no localStorage conforme a regra
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
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
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, loading, error, login, logout }
})
