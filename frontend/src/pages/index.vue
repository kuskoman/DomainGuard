<template>
  <v-container class="text-center py-10">
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <h1 class="display-3 mb-6 primary--text">DomainGuard</h1>
        <p class="subtitle-1 mb-6">
          DomainGuard is a powerful tool for monitoring the validity of domains and SSL certificates, ensuring online
          safety for businesses and individuals.
        </p>
        <v-btn color="primary" large elevation="2" :to="getStartedLink"> Get Started </v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-10">
      <v-col cols="12" md="6">
        <v-card elevation="2" class="rounded-card">
          <v-card-title>Key Features</v-card-title>
          <v-card-text>
            <ul class="styled-list">
              <li>Automatic subdomain discovery</li>
              <li>SSL certificate status monitoring</li>
              <li>Expiration notifications</li>
              <li>User dashboard with detailed status</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="2" class="rounded-card">
          <v-card-title>Who is it for?</v-card-title>
          <v-card-text>
            <ul class="styled-list">
              <li>Website administrators</li>
              <li>Hosting companies</li>
              <li>Businesses with an online presence</li>
              <li>Individuals with personal websites</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const registerLink = "/user/register";
const domainsLink = "/domains";

const getStartedLink = computed(() => (userStore.accessToken ? domainsLink : registerLink));
</script>

<style lang="scss" scoped>
h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.v-card.rounded-card {
  border-radius: 16px;
  padding: 1.5rem;
}

.styled-list {
  list-style-type: none;
  padding-left: 0;
}
</style>
