<script setup lang="ts">
import TopNavbar from "@/components/generic/TopNavbar.vue";
</script>

<template>
  <v-app>
    <TopNavbar />
    <AlertsBar />
    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>
