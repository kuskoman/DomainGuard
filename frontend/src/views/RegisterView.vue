<template>
  <v-card class="mx-auto" max-width="344" title="User Registration">
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

      <v-btn color="success" @click="completeRegistration"> Complete Registration </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type RegisterUserInput, registerUser } from '../api/users/register'

const email = ref('')
const password = ref('')

const completeRegistration = async () => {
  const inputData: RegisterUserInput = {
    email: email.value,
    password: password.value
  }

  try {
    const result = await registerUser(inputData)
    console.log(result)
    // Navigate to another page or show success message
  } catch (error) {
    console.error(error)
    // Show error message
  }
}
</script>
