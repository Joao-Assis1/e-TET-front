<template>
  <v-container class="fill-height bg-grey-lighten-5" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4" class="px-4">
        <v-card class="elevation-3 rounded-xl pb-2">
          <!-- Cabeçalho Verde -->
          <div class="pa-8 mx-0 mt-0 rounded-t-xl rounded-b-lg" style="background-color: #05684b">
            <div class="text-center text-h4 font-weight-bold text-white mb-2">e-TET</div>
            <div class="text-center text-subtitle-1 text-white">Acesso Restrito</div>
          </div>

          <v-card-text class="px-6 pt-6">
            <v-alert
              v-if="authStore.error"
              type="error"
              variant="tonal"
              class="mb-4"
              closable
              @click:close="authStore.error = null"
            >
              {{ authStore.error }}
            </v-alert>

            <v-form @submit.prevent="handleLogin" ref="formRef">
              <!-- Campo Usuário -->
              <div class="text-subtitle-2 font-weight-bold text-blue-grey-darken-3 mb-2 ml-1">
                Usuário
              </div>
              <v-text-field
                v-model="username"
                placeholder="admin"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :rules="[(v) => !!v || 'O usuário é obrigatório']"
                required
                class="mb-5 custom-input"
                rounded="lg"
                color="teal-darken-3"
              ></v-text-field>

              <!-- Campo Senha -->
              <div class="text-subtitle-2 font-weight-bold text-blue-grey-darken-3 mb-2 ml-1">
                Senha
              </div>
              <v-text-field
                v-model="password"
                placeholder="........"
                prepend-inner-icon="mdi-lock-outline"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :rules="[(v) => !!v || 'A senha é obrigatória']"
                required
                class="mb-6 custom-input"
                rounded="lg"
                color="teal-darken-3"
              ></v-text-field>

              <!-- Botão Entrar -->
              <v-btn
                type="submit"
                size="x-large"
                block
                :loading="authStore.loading"
                class="rounded-xl text-none font-weight-bold text-white mb-2 elevation-1"
                style="background-color: #0c9c6e"
              >
                Entrar
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const formRef = ref(null)

const username = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  const { valid } = await formRef.value.validate()

  if (valid) {
    const success = await authStore.login(username.value, password.value)
    if (success) {
      router.push({ name: 'home' })
    }
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 20px !important;
}

.custom-input :deep(.v-field) {
  border-radius: 12px;
}

.custom-input :deep(.v-field__outline__start) {
  border-radius: 12px 0 0 12px !important;
}

.custom-input :deep(.v-field__outline__end) {
  border-radius: 0 12px 12px 0 !important;
}

.custom-input :deep(.v-field__outline) {
  color: #cfd8dc !important; /* light gray-blue border */
}
</style>
