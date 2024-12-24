<template>
  <v-footer height="40" app>
    <div class="d-flex justify-center align-center w-100 text-on-surface-variant">
      &copy; 2023-{{ new Date().getFullYear() }} DomainGuard
    </div>
  </v-footer>
</template>

<style scoped lang="scss">
.v-footer {
  background-color: rgba(var(--v-theme-primary));
}

.v-footer {
  font-size: 0.875rem;
}
</style>
