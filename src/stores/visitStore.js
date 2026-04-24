import { defineStore } from 'pinia'
import { ref } from 'vue'
import { visitService } from '../services/visitService'
import { db } from '../services/localDb'
import { generateId } from '../utils/uuid'
import { areIdsEqual } from '../utils/idNormalization'

export const useVisitStore = defineStore('visit', () => {
  const history = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Carrega do IndexedDB no início.
   */
  const loadFromLocal = async () => {
    try {
      const saved = await db.visits.toArray()
      history.value = saved || []
      return history.value
    } catch (err) {
      console.error('Erro ao carregar visitas do IndexedDB:', err)
      return []
    }
  }

  /**
   * Sincroniza o estado em memória com o banco local.
   */
  const saveToLocal = async () => {
    try {
      await db.visits.clear()
      if (history.value.length > 0) {
        await db.visits.bulkAdd(JSON.parse(JSON.stringify(history.value)))
      }
    } catch (err) {
      console.error('Erro ao salvar visitas no IndexedDB:', err)
    }
  }

  const fetchHistory = async (type, id) => {
    loading.value = true
    error.value = null
    try {
      const data = await visitService.getHistory(type, id)
      
      const apiVisits = data.map(v => ({ ...v, syncStatus: 'SYNCED' }))
      
      const otherVisits = history.value.filter(v => {
        const matchesType = (type === 'household' && v.household_id === id) ||
                          (type === 'family' && v.family_id === id) ||
                          (type === 'individual' && v.individual_id === id)
        return !matchesType
      })

      history.value = [...otherVisits, ...apiVisits]
      await saveToLocal()
      return apiVisits
    } catch (err) {
      console.warn('Falha ao buscar histórico da API.', err)
      await loadFromLocal()
      return history.value.filter(v => 
        (type === 'household' && v.household_id === id) ||
        (type === 'family' && v.family_id === id) ||
        (type === 'individual' && v.individual_id === id)
      )
    } finally {
      loading.value = false
    }
  }

  const recordVisit = async (visitData) => {
    const now = new Date().toISOString()
    const newVisit = {
      ...visitData,
      id: generateId(),
      syncStatus: 'PENDING',
      createdAt: now,
      updatedAt: now
    }
    history.value.push(newVisit)
    await db.visits.add(JSON.parse(JSON.stringify(newVisit)))
    return newVisit
  }

  return {
    history,
    loading,
    error,
    fetchHistory,
    recordVisit,
    saveToLocal,
    loadFromLocal
  }
})
