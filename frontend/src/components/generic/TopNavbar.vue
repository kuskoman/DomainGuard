<template>
  <NavigationDrawer :drawer="drawer" @update:drawer="toggleDrawer" />
  <AppBar :toggleDrawer="toggleDrawer" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const drawer = ref(false);

const toggleDrawer = (value: boolean) => {
  drawer.value = value;
};
</script>
