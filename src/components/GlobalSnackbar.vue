<template>
  <v-snackbar
    v-model="uiStore.snackbar.show"
    :color="uiStore.snackbar.color"
    :timeout="uiStore.snackbar.timeout"
    location="bottom center"
  >
    {{ uiStore.snackbar.message }}

    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="uiStore.snackbar.show = false"
      >
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { useUiStore } from '../stores/uiStore'

const uiStore = useUiStore()
</script>
