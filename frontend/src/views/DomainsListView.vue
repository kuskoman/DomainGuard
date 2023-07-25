<template>
  <div>
    <h1>Domains List</h1>
    <div v-for="domain in domains" :key="domain.id">
      <DomainRow
        :name="domain.name"
        :id="domain.id"
        :userId="domain.userId"
        :expirationDate="domain.expirationDate"
        :lastCheckedAt="domain.lastCheckedAt"
        :createdAt="domain.createdAt"
        :updatedAt="domain.updatedAt"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { type GetDomainDto, listDomains } from '@/api/domains'
import DomainRow from '../components/DomainRow.vue'

export default {
  components: {
    DomainRow
  },
  data() {
    return {
      domains: new Array<GetDomainDto>(),
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Domain ID', value: 'id' },
        { text: 'User ID', value: 'userId' },
        { text: 'Expiration Date', value: 'expirationDate' },
        { text: 'Last Checked At', value: 'lastCheckedAt' },
        { text: 'Created At', value: 'createdAt' },
        { text: 'Updated At', value: 'updatedAt' },
        { text: 'Actions', value: 'action', sortable: false }
      ]
    }
  },
  async created() {
    this.domains = await listDomains()
  }
}
</script>
