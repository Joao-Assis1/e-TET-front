<template>
  <v-container>
    <div class="d-flex align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Pessoas</h1>
      <v-spacer />
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Buscar cidadão..."
        variant="solo-filled"
        flat
        density="compact"
        hide-details
        rounded="lg"
        class="max-width-300"
      />
    </div>

    <v-card border elevation="0" rounded="xl">
      <v-list lines="two">
        <template v-for="(person, index) in filteredPeople" :key="person.id">
          <v-list-item
            :title="person.nome_completo"
            :subtitle="`CPF: ${person.cpf || '---'} | CNS: ${person.cartao_sus || '---'}`"
            :to="`/citizens/${person.id}/edit`"
          >
            <template v-slot:prepend>
              <v-avatar :color="person.sexo === 'Masculino' ? 'blue-lighten-4' : 'pink-lighten-4'" class="mr-3">
                <v-icon :color="person.sexo === 'Masculino' ? 'blue' : 'pink'">
                  {{ person.sexo === 'Masculino' ? 'mdi-account' : 'mdi-account-heart' }}
                </v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-chip v-if="person.is_responsavel" size="x-small" color="primary" variant="flat">
                Resp.
              </v-chip>
              <v-btn icon="mdi-chevron-right" variant="text" />
            </template>
          </v-list-item>
          <v-divider v-if="index < filteredPeople.length - 1" inset />
        </template>
        <div v-if="filteredPeople.length === 0" class="text-center pa-8 text-grey">
          Nenhum cidadão cadastrado localmente.
        </div>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useIndividualStore } from '../stores/individualStore'

const individualStore = useIndividualStore()
const search = ref('')

const filteredPeople = computed(() => {
  // Logic to get all people from store
  return []
})
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style>
