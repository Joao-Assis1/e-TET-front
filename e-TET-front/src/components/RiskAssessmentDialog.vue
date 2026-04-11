<template>
  <v-dialog v-model="internalValue" max-width="600" scrollable transition="dialog-bottom-transition">
    <v-card rounded="xl" class="overflow-hidden">
      <!-- Header -->
      <v-toolbar color="primary" class="px-2" flat height="64">
        <v-icon start color="white" class="ml-2">mdi-shield-check-outline</v-icon>
        <v-toolbar-title class="text-white font-weight-bold text-subtitle-1">
          Estratificação de Risco (Coelho-Savassi)
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" color="white" @click="close"></v-btn>
      </v-toolbar>

      <v-card-text class="pa-0">
        <v-form ref="formRef" class="pa-5">
          <div class="text-caption text-uppercase font-weight-bold text-medium-emphasis mb-4">
            Sentinelas para Família de {{ familyName }}
          </div>

          <v-row dense>
            <!-- Campos Numéricos -->
            <v-col cols="12" sm="6" v-for="field in numericFields" :key="field.key">
              <div class="field-item pa-3 border rounded-lg mb-2 bg-grey-lighten-5">
                <div class="d-flex align-center justify-space-between mb-1">
                  <div class="text-caption font-weight-bold text-grey-darken-2">
                    {{ field.label }}
                  </div>
                  <v-tooltip v-if="field.description" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" size="14" color="grey">mdi-help-circle-outline</v-icon>
                    </template>
                    {{ field.description }}
                  </v-tooltip>
                </div>
                <v-text-field
                  v-model.number="form[field.key]"
                  type="number"
                  min="0"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  bg-color="white"
                  :rules="[v => v >= 0 || 'Valor deve ser positivo']"
                />
              </div>
            </v-col>

            <!-- Campo Boolean -->
            <v-col cols="12">
              <v-card variant="outlined" class="pa-3 border rounded-lg bg-grey-lighten-5" elevation="0">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-caption font-weight-bold text-grey-darken-2 text-uppercase">Saneamento Precário</div>
                    <div class="text-caption text-medium-emphasis">Ex: Lixo a céu aberto, sem água tratada</div>
                  </div>
                  <v-switch
                    v-model="form.poorSanitation"
                    color="primary"
                    hide-details
                    inset
                  ></v-switch>
                </div>
              </v-card>
            </v-col>

            <!-- Rooms Count -->
            <v-col cols="12" class="mt-2">
              <div class="field-item pa-3 border rounded-lg bg-green-lighten-5 border-primary">
                <div class="text-caption font-weight-bold text-primary mb-1 text-uppercase">Cômodos na Residência</div>
                <v-slider
                  v-model="form.roomsCount"
                  min="1"
                  max="15"
                  step="1"
                  thumb-label="always"
                  color="primary"
                  hide-details
                  class="mt-6"
                />
              </div>
            </v-col>
          </v-row>

          <!-- Warning: Soma de sentinelas vs membros -->
          <v-alert
            v-if="totalSentinels > familySize"
            type="warning"
            variant="tonal"
            class="mt-4 text-caption"
            density="compact"
            border="start"
          >
            A soma das sentinelas de saúde ({{ totalSentinels }}) é superior ao número de membros da família ({{ familySize }}). Verifique se as contagens estão corretas.
          </v-alert>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4 bg-grey-lighten-4">
        <v-btn variant="text" class="text-none font-weight-bold" @click="close">Cancelar</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="flat"
          class="text-none font-weight-bold px-8"
          rounded="lg"
          @click="save"
          :loading="loading"
        >
          Confirmar Pontuação
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  family: {
    type: Object,
    required: true
  },
  loading: Boolean
})

const emit = defineEmits(['update:modelValue', 'save'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref(null)

const form = reactive({
  bedriddenCount: 0,
  physicalDisabilityCount: 0,
  mentalDisabilityCount: 0,
  severeMalnutritionCount: 0,
  drugAddictionCount: 0,
  unemployedCount: 0,
  illiterateCount: 0,
  under6MonthsCount: 0,
  over70YearsCount: 0,
  hypertensionCount: 0,
  diabetesCount: 0,
  poorSanitation: false,
  roomsCount: 1
})

const familyName = computed(() => {
  return props.family?.responsavel?.nome_completo?.split(' ')[0] || 'Família'
})

const familySize = computed(() => {
  return props.family?.individuals?.length || (props.family?.membros_declarados || 1)
})

const totalSentinels = computed(() => {
  return form.bedriddenCount + 
         form.physicalDisabilityCount + 
         form.mentalDisabilityCount + 
         form.severeMalnutritionCount + 
         form.drugAddictionCount + 
         form.hypertensionCount + 
         form.diabetesCount
})

const numericFields = [
  { key: 'bedriddenCount', label: 'ACAMADOS', description: 'Pessoas restritas ao leito' },
  { key: 'physicalDisabilityCount', label: 'DEF. FÍSICA', description: 'Pessoas com deficiência física' },
  { key: 'mentalDisabilityCount', label: 'DEF. MENTAL', description: 'Pessoas com deficiência mental' },
  { key: 'severeMalnutritionCount', label: 'DESNUTRIÇÃO', description: 'Desnutrição grave em crianças/adultos' },
  { key: 'drugAddictionCount', label: 'DEPENDÊNCIA', description: 'Uso abusivo de álcool ou drogas' },
  { key: 'hypertensionCount', label: 'HIPERTENSÃO', description: 'Pacientes com diagnóstico médico' },
  { key: 'diabetesCount', label: 'DIABETES', description: 'Pacientes com diagnóstico médico' },
  { key: 'unemployedCount', label: 'DESEMPREGO', description: 'Adultos sem renda/trabalho' },
  { key: 'illiterateCount', label: 'ANALFABETISMO', description: 'Maiores de 15 anos que não leem/escrevem' },
  { key: 'under6MonthsCount', label: 'MENORES 6 MESES', description: 'Crianças na família' },
  { key: 'over70YearsCount', label: 'MAIORES 70 ANOS', description: 'Idosos na família' }
]

const close = () => {
  internalValue.value = false
}

const save = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  emit('save', { ...form })
}

// Reset form when dialog opens
watch(internalValue, (val) => {
  if (val) {
    Object.assign(form, {
      bedriddenCount: 0,
      physicalDisabilityCount: 0,
      mentalDisabilityCount: 0,
      severeMalnutritionCount: 0,
      drugAddictionCount: 0,
      unemployedCount: 0,
      illiterateCount: 0,
      under6MonthsCount: 0,
      over70YearsCount: 0,
      hypertensionCount: 0,
      diabetesCount: 0,
      poorSanitation: false,
      roomsCount: 1
    })
  }
})
</script>

<style scoped>
.field-item {
  transition: all 0.2s;
}
.field-item:focus-within {
  border-color: rgb(var(--v-theme-primary)) !important;
  background-color: white !important;
}
.border-primary {
  border-color: #2E7D32 !important;
}
</style>
