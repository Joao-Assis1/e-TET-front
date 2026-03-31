import api from './api'

export const visitService = {
  /**
   * POST /visits — Registra uma nova visita domiciliar ou territorial.
   * @param {Object} data - Payload da visita (household_id, desfecho, turno, etc.)
   * @returns {Promise<Object>} Resposta da API
   */
  create: async (data) => {
    const response = await api.post('/visits', data)
    return response.data
  },

  /**
   * GET /visits — Lista todas as visitas (opcionalmente filtradas).
   */
  getAll: async () => {
    const response = await api.get('/visits')
    return response.data
  }
}
