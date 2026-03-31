<template>
  <div>
    <v-app-bar color="primary" density="comfortable" elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title class="font-weight-bold">e-TET</v-app-bar-title>
      <v-spacer />
      <v-chip variant="tonal" color="white" size="small" class="mr-2">
        <v-icon start size="16">mdi-account</v-icon>
        {{ authStore.user?.usuario || 'Usuário' }}
      </v-chip>
      <v-btn icon variant="text" @click="handleLogout" aria-label="Sair">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <div class="drawer-header pa-5" style="background: linear-gradient(135deg, #05684B, #0C9C6E);">
        <v-icon size="40" color="white" class="mb-2">mdi-account-circle</v-icon>
        <div class="text-subtitle-1 font-weight-bold text-white">{{ authStore.user?.usuario }}</div>
        <div class="text-caption" style="color: rgba(255,255,255,0.8);">{{ roleLabel }}</div>
      </div>
      <v-divider />
      <v-list nav class="pa-2">
        <v-list-item
          prepend-icon="mdi-home-group"
          title="Domicílios"
          to="/households"
          rounded="lg"
          color="primary"
        />
      </v-list>
      <template v-slot:append>
        <div class="pa-4">
          <v-btn block variant="outlined" color="error" @click="handleLogout" class="text-none">
            <v-icon start>mdi-logout</v-icon>
            Sair
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const drawer = ref(false)

const roleLabels = { admin: 'Administrador', gestor: 'Gestor', profissional: 'Profissional' }
const roleLabel = computed(() => roleLabels[authStore.user?.role] || 'Profissional')

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.drawer-header {
  display: flex;
  flex-direction: column;
}
</style>
