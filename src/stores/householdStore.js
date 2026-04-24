import { defineStore } from 'pinia'
import { ref } from 'vue'
import { householdService } from '../services/householdService'
import { db } from '../services/localDb'
import { generateId } from '../utils/uuid'

export const useHouseholdStore = defineStore('household', () => {
  const households = ref([])
  const currentHousehold = ref(null)
  const loading = ref(false)
  const error = ref(null)

  /**
   * Carrega do IndexedDB (Dexie) no início.
   */
  const loadFromLocal = async () => {
    try {
      const saved = await db.households.toArray()
      households.value = saved || []
      return households.value
    } catch (err) {
      console.error('Erro ao carregar domicílios do IndexedDB:', err)
      return []
    }
  }

  /**
   * Sincroniza o estado em memória com o banco local.
   */
  const saveToLocal = async () => {
    try {
      // Limpa e reinsere para garantir integridade (ou usa bulkPut se IDs forem consistentes)
      await db.households.clear()
      if (households.value.length > 0) {
        await db.households.bulkAdd(JSON.parse(JSON.stringify(households.value)))
      }
    } catch (err) {
      console.error('Erro ao salvar domicílios no IndexedDB:', err)
    }
  }

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const apiHouseholds = await householdService.getAll()
      
      const normalize = (s) => String(s || '').toLowerCase().trim()
      
      const unsynced = households.value.filter(h => {
        if (h.syncStatus === 'SYNCED') return false
        
        const alreadyInApi = apiHouseholds.find(ah => 
          normalize(ah.logradouro) === normalize(h.logradouro) &&
          normalize(ah.numero) === normalize(h.numero) &&
          normalize(ah.bairro) === normalize(h.bairro)
        )
        return !alreadyInApi
      })

      households.value = [
        ...apiHouseholds.map(h => ({ ...h, syncStatus: 'SYNCED' })),
        ...unsynced
      ]
      await saveToLocal()
    } catch (err) {
      console.warn('Falha ao buscar domicílios da API, usando dados locais.', err)
      await loadFromLocal()
    } finally {
      loading.value = false
    }
  }

  const pruneOrphanedHouseholds = async () => {
    loading.value = true
    try {
      const allApi = await householdService.getAll()
      const apiIds = new Set(allApi.map(h => h.id))
      
      const before = households.value.length
      households.value = households.value.filter(h => {
        if (h.syncStatus !== 'SYNCED') return true
        return apiIds.has(h.id)
      })
      
      if (households.value.length < before) {
        await saveToLocal()
      }
    } catch (err) {
      console.error('Falha ao podar domicílios órfãos', err)
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id) => {
    // Primeiro tenta no estado em memória carregado
    const local = households.value.find(h => h.id === id)
    if (local) {
      currentHousehold.value = local
      return local
    }

    // Se não estiver em memória, tenta direto no Dexie
    const dbItem = await db.households.get(id)
    if (dbItem) {
      currentHousehold.value = dbItem
      return dbItem
    }

    loading.value = true
    error.value = null
    try {
      const data = await householdService.getById(id)
      currentHousehold.value = { ...data, syncStatus: 'SYNCED' }
      return currentHousehold.value
    } catch (err) {
      error.value = 'Erro ao carregar domicílio.'
      return null
    } finally {
      loading.value = false
    }
  }

  const create = async (data) => {
    const now = new Date().toISOString()
    const newHousehold = {
      ...data,
      id: generateId(),
      syncStatus: 'PENDING',
      createdAt: now,
      updatedAt: now
    }
    households.value.push(newHousehold)
    
    // Persistência imediata no Dexie
    await db.households.add(JSON.parse(JSON.stringify(newHousehold)))
    
    return newHousehold
  }

  const update = async (id, data) => {
    const idx = households.value.findIndex((h) => h.id === id)
    if (idx !== -1) {
      const current = households.value[idx]
      const newStatus = current.syncStatus === 'SYNCED' ? 'PENDING' : current.syncStatus
      
      const updated = { 
        ...current, 
        ...data, 
        syncStatus: newStatus,
        updatedAt: new Date().toISOString()
      }
      
      households.value[idx] = updated
      
      // Persistência imediata no Dexie
      await db.households.put(JSON.parse(JSON.stringify(updated)))
      
      if (currentHousehold.value && currentHousehold.value.id === id) {
        currentHousehold.value = updated
      }
      return updated
    }
    return null
  }

  const remove = async (id) => {
    loading.value = true
    error.value = null
    try {
      const household = households.value.find(h => h.id === id)
      if (household && household.syncStatus === 'SYNCED') {
        await householdService.remove(id)
      }
      
      households.value = households.value.filter((h) => h.id !== id)
      
      // Remoção imediata no Dexie
      await db.households.delete(id)
      
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao excluir domicílio.'
      return false
    } finally {
      loading.value = false
    }
  }

  // Inicialização assíncrona feita pelo componente ou AppLayout
  // loadFromLocal() 

  return {
    households,
    currentHousehold,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    pruneOrphanedHouseholds,
    saveToLocal,
    loadFromLocal
  }
})
