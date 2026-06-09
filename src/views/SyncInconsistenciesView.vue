<template>
  <div class="sync-inconsistencies fill-height bg-grey-lighten-4 pa-4 pb-16">
    <!-- Cabeçalho Estético -->
    <v-card flat class="rounded-xl overflow-hidden mb-6 shadow-sm border-0 position-relative header-card">
      <div class="header-overlay pa-6 text-white d-flex flex-column justify-center">
        <div class="d-flex align-center mb-2">
          <v-avatar color="rgba(255, 255, 255, 0.2)" class="mr-4 animate-icon">
            <v-icon size="28" color="white">mdi-sync-alert</v-icon>
          </v-avatar>
          <div>
            <h1 class="text-h5 font-weight-bold mb-0">Inconsistências de Sincronização</h1>
            <p class="text-caption mb-0 text-white-opacity">
              Corrija os dados apontados pelo servidor para concluir a sincronização com sucesso.
            </p>
          </div>
        </div>
      </div>
    </v-card>

    <!-- Alerta de Auto-Reparo Inteligente -->
    <v-alert
      v-if="hasAutoRepairedItems"
      type="warning"
      variant="tonal"
      class="rounded-xl mb-6 shadow-sm border-0"
      border="start"
      icon="mdi-auto-fix"
      title="Auto-Reparo de Sincronização Ativado!"
    >
      <div class="text-body-2 mt-1">
        Detectamos que alguns registros superiores (como o Domicílio da Família ou a Família do Cidadão) 
        estavam marcados localmente como sincronizados, mas estão ausentes no servidor central.
      </div>
      <div class="text-body-2 font-weight-bold mt-2">
        💡 O que fazer? Seus registros locais já foram automaticamente marcados para re-sincronização. 
        Basta clicar em <strong>Sincronizar</strong> no menu lateral para enviar tudo de uma vez!
      </div>
    </v-alert>

    <!-- Resumo de Erros -->
    <v-row dense class="mb-4">
      <v-col cols="6" sm="3">
        <v-card flat class="rounded-xl pa-4 text-center cursor-pointer" @click="activeTab = 0" :class="activeTab === 0 ? 'bg-primary-light border-primary' : 'bg-white border-subtle'">
          <v-icon size="24" :color="activeTab === 0 ? 'primary' : 'grey-darken-1'" class="mb-2">mdi-home-city</v-icon>
          <div class="text-caption text-grey-darken-1 font-weight-bold">Domicílios</div>
          <div class="text-h6 font-weight-bold" :class="errorsCount.households > 0 ? 'text-error animate-pulse' : 'text-grey-darken-3'">
            {{ errorsCount.households }}
          </div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card flat class="rounded-xl pa-4 text-center cursor-pointer" @click="activeTab = 1" :class="activeTab === 1 ? 'bg-primary-light border-primary' : 'bg-white border-subtle'">
          <v-icon size="24" :color="activeTab === 1 ? 'primary' : 'grey-darken-1'" class="mb-2">mdi-account-group</v-icon>
          <div class="text-caption text-grey-darken-1 font-weight-bold">Famílias</div>
          <div class="text-h6 font-weight-bold" :class="errorsCount.families > 0 ? 'text-error animate-pulse' : 'text-grey-darken-3'">
            {{ errorsCount.families }}
          </div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card flat class="rounded-xl pa-4 text-center cursor-pointer" @click="activeTab = 2" :class="activeTab === 2 ? 'bg-primary-light border-primary' : 'bg-white border-subtle'">
          <v-icon size="24" :color="activeTab === 2 ? 'primary' : 'grey-darken-1'" class="mb-2">mdi-account-multiple</v-icon>
          <div class="text-caption text-grey-darken-1 font-weight-bold">Cidadãos</div>
          <div class="text-h6 font-weight-bold" :class="errorsCount.individuals > 0 ? 'text-error animate-pulse' : 'text-grey-darken-3'">
            {{ errorsCount.individuals }}
          </div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card flat class="rounded-xl pa-4 text-center cursor-pointer" @click="activeTab = 3" :class="activeTab === 3 ? 'bg-primary-light border-primary' : 'bg-white border-subtle'">
          <v-icon size="24" :color="activeTab === 3 ? 'primary' : 'grey-darken-1'" class="mb-2">mdi-calendar-check</v-icon>
          <div class="text-caption text-grey-darken-1 font-weight-bold">Visitas</div>
          <div class="text-h6 font-weight-bold" :class="errorsCount.visits > 0 ? 'text-error animate-pulse' : 'text-grey-darken-3'">
            {{ errorsCount.visits }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tela de Sucesso Completo -->
    <v-card v-if="syncStore.inconsistenciesCount === 0" flat class="rounded-xl pa-12 text-center bg-white shadow-sm mt-4">
      <v-avatar size="120" color="success-light" class="mb-6 animate-bounce">
        <v-icon size="64" color="success">mdi-cloud-check</v-icon>
      </v-avatar>
      <h2 class="text-h5 font-weight-bold text-grey-darken-4 mb-2">Tudo Limpo por Aqui!</h2>
      <p class="text-body-1 text-grey mb-6 max-width-p mx-auto">
        A última sincronização não reportou nenhuma inconsistência ou erro de integridade de dados.
      </p>
      <v-btn color="primary" class="rounded-lg font-weight-bold px-8 py-3" elevation="0" to="/households">
        Ir para Domicílios
      </v-btn>
    </v-card>

    <!-- Listagem de Erros Filtrada -->
    <v-window v-else v-model="activeTab" class="mt-4">
      <!-- Abas de Itens -->
      <v-window-item v-for="category in categories" :key="category.value" :value="category.value">
        <div v-if="category.errors.length === 0" class="d-flex flex-column align-center py-12 bg-white rounded-xl shadow-sm">
          <v-avatar size="80" color="grey-lighten-4" class="mb-4">
            <v-icon size="36" color="grey-lighten-1">mdi-check-circle-outline</v-icon>
          </v-avatar>
          <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-3">Nenhum erro nesta categoria</h3>
          <p class="text-body-2 text-grey">Todos os registros deste tipo foram salvos com sucesso.</p>
        </div>

        <div v-else class="d-flex flex-column ga-4">
          <v-card
            v-for="(err, idx) in category.errors"
            :key="idx"
            flat
            class="rounded-xl pa-5 border-left-error bg-white shadow-sm hover-card transition-all"
          >
            <div class="d-flex flex-column flex-sm-row justify-space-between align-start ga-4">
              <div class="flex-grow-1">
                <!-- Título Resolvido ou ID -->
                <div class="d-flex align-center flex-wrap ga-2 mb-2">
                  <v-chip size="x-small" color="error" variant="flat" class="font-weight-bold">
                    {{ category.label }}
                  </v-chip>
                  <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4">
                    {{ resolveName(category.key, err.id) }}
                  </h3>
                </div>

                <v-alert
                  :type="(err.erro || '').includes('Conflito de concorrência') ? 'warning' : 'error'"
                  variant="tonal"
                  density="comfortable"
                  class="rounded-lg text-caption font-weight-medium pa-3 mb-0"
                  :icon="(err.erro || '').includes('Conflito de concorrência') ? 'mdi-account-sync-outline' : 'mdi-alert-octagon'"
                >
                  <div class="d-flex align-center">
                    <span v-if="(err.erro || '').includes('Conflito de concorrência')" class="font-weight-bold mr-2">Conflito de Versão:</span>
                    <span>{{ err.erro || 'Falha de validação desconhecida.' }}</span>
                  </div>
                </v-alert>
                <div class="text-caption text-grey mt-2">
                  ID: <span class="font-mono">{{ err.id }}</span>
                </div>
              </div>

              <!-- Ações rápidas de correção -->
              <div class="flex-shrink-0 d-flex flex-sm-column align-stretch ga-2 align-self-sm-center width-sm-auto">
                <v-btn
                  v-if="hasCorrectionLink(category.key, err.id)"
                  color="error"
                  variant="flat"
                  class="rounded-lg font-weight-bold px-6 text-none action-btn"
                  @click="goToCorrection(category.key, err.id)"
                >
                  <v-icon start size="18">mdi-pencil</v-icon>
                  Corrigir
                </v-btn>
              </div>
            </div>
          </v-card>
        </div>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSyncStore } from '../stores/syncStore'
import { useHouseholdStore } from '../stores/householdStore'
import { useFamilyStore } from '../stores/familyStore'
import { useIndividualStore } from '../stores/individualStore'
import { useVisitStore } from '../stores/visitStore'

const router = useRouter()
const syncStore = useSyncStore()
const householdStore = useHouseholdStore()
const familyStore = useFamilyStore()
const individualStore = useIndividualStore()
const visitStore = useVisitStore()

const activeTab = ref(0)

const errorsCount = computed(() => {
  const inc = syncStore.inconsistencies || {}
  return {
    households: inc.households?.length || 0,
    families: inc.families?.length || 0,
    individuals: inc.individuals?.length || 0,
    visits: inc.visits?.length || 0,
  }
})

const categories = computed(() => {
  const inc = syncStore.inconsistencies || {}
  return [
    { value: 0, key: 'households', label: 'Domicílio', errors: inc.households || [] },
    { value: 1, key: 'families', label: 'Família', errors: inc.families || [] },
    { value: 2, key: 'individuals', label: 'Cidadão', errors: inc.individuals || [] },
    { value: 3, key: 'visits', label: 'Visita', errors: inc.visits || [] },
  ]
})

// Verifica se há registros que ativaram o auto-reparo de integridade
const hasAutoRepairedItems = computed(() => {
  const inc = syncStore.inconsistencies || {}
  const hasFamilyMissingHousehold = inc.families?.some(err => /Domicílio associado não encontrado/i.test(err.erro))
  const hasIndividualMissingFamily = inc.individuals?.some(err => /Família associada não encontrada/i.test(err.erro))
  return hasFamilyMissingHousehold || hasIndividualMissingFamily
})

// Resolve o ID técnico para um nome de rua ou nome de cidadão inteligível
const resolveName = (categoryKey, id) => {
  if (categoryKey === 'households') {
    const item = householdStore.households.find(h => h.id === id || h._tempId === id)
    return item ? `${item.logradouro}, nº ${item.numero}` : `Domicílio (ID: ${String(id).substring(0, 8)})`
  }
  if (categoryKey === 'families') {
    const item = familyStore.families.find(f => f.id === id || f._tempId === id)
    return item ? `Família Prontuário: ${item.numero_prontuario}` : `Família (ID: ${String(id).substring(0, 8)})`
  }
  if (categoryKey === 'individuals') {
    const item = individualStore.individuals.find(i => i.id === id || i._tempId === id)
    return item ? item.nome_completo : `Cidadão (ID: ${String(id).substring(0, 8)})`
  }
  if (categoryKey === 'visits') {
    const item = visitStore.history.find(v => v.id === id || v._tempId === id)
    if (item) {
      const ind = individualStore.individuals.find(i => i.id === item.individual_id || i._tempId === item.individual_id)
      return `Visita a ${ind ? ind.nome_completo : 'Cidadão'}`
    }
    return `Visita (ID: ${String(id).substring(0, 8)})`
  }
  return id
}

// Verifica se há como redirecionar para corrigir o erro
const hasCorrectionLink = (categoryKey, id) => {
  if (categoryKey === 'households') {
    return householdStore.households.some(h => h.id === id || h._tempId === id)
  }
  if (categoryKey === 'families') {
    return familyStore.families.some(f => f.id === id || f._tempId === id)
  }
  if (categoryKey === 'individuals') {
    return individualStore.individuals.some(i => i.id === id || i._tempId === id)
  }
  if (categoryKey === 'visits') {
    return visitStore.history.some(v => v.id === id || v._tempId === id)
  }
  return false
}

// Navega diretamente para a correção apropriada
const goToCorrection = (categoryKey, id) => {
  if (categoryKey === 'households') {
    const item = householdStore.households.find(h => h.id === id || h._tempId === id)
    if (item) router.push({ name: 'household-edit', params: { id: item.id || item._tempId } })
  }
  if (categoryKey === 'families') {
    const item = familyStore.families.find(f => f.id === id || f._tempId === id)
    if (item) {
      if (item.household_id) router.push({ name: 'household-detail', params: { id: item.household_id } })
      else router.push({ name: 'families' })
    }
  }
  if (categoryKey === 'individuals') {
    const item = individualStore.individuals.find(i => i.id === id || i._tempId === id)
    if (item) router.push({ name: 'citizen-edit', params: { id: item.id || item._tempId } })
  }
  if (categoryKey === 'visits') {
    router.push({ name: 'visits' })
  }
}
</script>

<style scoped>
.sync-inconsistencies {
  min-height: 100vh;
}
.header-card {
  background: linear-gradient(135deg, #cc2b2b, #8b1313) !important;
}
.header-overlay {
  background: rgba(0, 0, 0, 0.15);
}
.text-white-opacity {
  color: rgba(255, 255, 255, 0.85);
}
.max-width-p {
  max-width: 480px;
}
.success-light {
  background-color: #e8f5e9 !important;
}
.border-subtle {
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}
.bg-primary-light {
  background-color: #ffebee !important;
}
.border-primary {
  border: 1.5px solid #d32f2f !important;
}
.border-left-error {
  border-left: 5px solid #d32f2f !important;
}
.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.08) !important;
}
.font-mono {
  font-family: monospace;
}
.transition-all {
  transition: all 0.25s ease-in-out;
}
.shadow-sm {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05) !important;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-bounce {
  animation: bounce 2s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}
.animate-pulse {
  animation: pulse 1.8s infinite ease-in-out;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-icon:hover {
  animation: rotate 1s linear;
}

@media (max-width: 600px) {
  .width-sm-auto {
    width: 100%;
  }
}
</style>
