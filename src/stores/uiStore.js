import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const snackbar = ref({
    show: false,
    message: '',
    color: 'error',
    timeout: 5000
  })

  const showError = (message, timeout = 5000) => {
    snackbar.value = {
      show: true,
      message,
      color: 'error',
      timeout
    }
  }

  const showSuccess = (message, timeout = 3000) => {
    snackbar.value = {
      show: true,
      message,
      color: 'success',
      timeout
    }
  }

  const showWarning = (message, timeout = 4000) => {
    snackbar.value = {
      show: true,
      message,
      color: 'warning',
      timeout
    }
  }

  return {
    snackbar,
    showError,
    showSuccess,
    showWarning
  }
})
