<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12" md="6" offset-md="3">
        <v-card elevation="2" class="p-6">
          <v-card-title class="text-h5">Login</v-card-title>
          <v-card-text>
            <LoginForm />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.v-card {
  border-radius: 16px;
}
</style>
