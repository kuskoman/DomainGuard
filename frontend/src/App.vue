<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {
  VAppBar,
  VApp,
  VSpacer,
  VToolbarTitle,
  VToolbarItems,
  VBtn,
  VContainer
} from 'vuetify/components'
import NotificationBar from './components/NotificationBar.vue'
</script>

<template>
  <v-app>
    <v-app-bar app color="indigo" dark>
      <v-toolbar-title>
        <router-link to="/" class="page-title">DomainGuard</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn to="/"> Home </v-btn>
        <v-btn to="/register"> Register </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <v-container>
        <notification-bar></notification-bar>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.page-title {
  color: white;
  text-decoration: none;
  font-weight: bold;
}
</style>
