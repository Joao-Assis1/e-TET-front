<template>
  <v-container>
    <div class="d-flex align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Famílias</h1>
      <v-spacer />
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Buscar família..."
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
        <template v-for="(family, index) in filteredFamilies" :key="family.id">
          <v-list-item
            :title="family.name || 'Família sem nome'"
            :subtitle="`Responsável: ${family.responsible || 'Não definido'}`"
            :to="`/families/${family.id}`"
          >
            <template v-slot:prepend>
              <v-avatar color="primary-lighten-4" class="mr-3">
                <v-icon color="primary">mdi-home-group</v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-chip size="x-small" variant="flat" color="orange" v-if="family.risk">
                {{ family.risk }}
              </v-chip>
              <v-btn icon="mdi-chevron-right" variant="text" />
            </template>
          </v-list-item>
          <v-divider v-if="index < filteredFamilies.length - 1" inset />
        </template>
        <div v-if="filteredFamilies.length === 0" class="text-center pa-8 text-grey">
          Nenhuma família carregada localmente.
        </div>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFamilyStore } from '../stores/familyStore'

const familyStore = useFamilyStore()
const search = ref('')

const filteredFamilies = computed(() => {
  // Logic to get all families from store
  return []
})
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style>
