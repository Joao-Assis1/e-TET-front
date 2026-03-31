import api from './api'

export const syncService = {
  /**
   * POST /sync/family
   * Envia família + todos os indivíduos de uma vez.
   * A API calcula a estratificação de risco Coelho-Savassi automaticamente.
   */
  async syncFamily(payload) {
    const response = await api.post('/sync/family', payload)
    return response.data
  },
}
