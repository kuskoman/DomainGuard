<template>
  <v-card class="mx-auto" max-width="344" title="User Login">
    <v-container>
      <v-text-field
        v-model="email"
        color="primary"
        label="Email"
        variant="underlined"
      ></v-text-field>

      <v-text-field
        v-model="password"
        color="primary"
        label="Password"
        placeholder="Enter your password"
        type="password"
        variant="underlined"
      ></v-text-field>
    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="success" @click="completeLogin"> Login </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const email = ref('')
const password = ref('')

const userStore = useUserStore()
const router = useRouter()

const completeLogin = async () => {
  await userStore.login({ email: email.value, password: password.value })

  if (userStore.isLoggedIn) {
    router.push({ name: 'dashboard' })
  }
}
</script>
