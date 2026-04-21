import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSyncStore } from './syncStore'
import { useIndividualStore } from './individualStore'
import { syncService } from '../services/syncService'

vi.mock('../services/syncService', () => ({
  syncService: {
    syncBatch: vi.fn(),
    pull: vi.fn()
  }
}))

describe('SyncStore (Integration Tests)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('deve calcular corretamente o pendingCount', async () => {
    const individualStore = useIndividualStore()
    const syncStore = useSyncStore()

    // Mock de dados locais pendentes
    individualStore.individuals = [
      { id: '1', nome_completo: 'Cidadao 1', syncStatus: 'PENDING' },
      { id: '2', nome_completo: 'Cidadao 2', syncStatus: 'SYNCED' }
    ]

    expect(syncStore.pendingCount).toBe(1)
  })

  it('deve mudar status para SYNCED após performSync com sucesso', async () => {
    const individualStore = useIndividualStore()
    const syncStore = useSyncStore()

    individualStore.individuals = [
      { id: 'uuid-123', nome_completo: 'Cidadao Sync', syncStatus: 'PENDING' }
    ]

    syncService.syncBatch.mockResolvedValue({
      individuals: [{ id: 'uuid-123', nome_completo: 'Cidadao Sync' }]
    })

    await syncStore.performSync()

    expect(individualStore.individuals[0].syncStatus).toBe('SYNCED')
    expect(syncStore.pendingCount).toBe(0)
  })
})
