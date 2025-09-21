<script setup lang="ts">
import type { UserInterface } from '@/types/type'

import Page from '@/components/global-layout/basic-page.vue'
import { useGetUsersQuery } from '@/services/api/users.api'

import { columns } from './components/columns'
import DataTable from './components/data-table.vue'
import UserCreate from './components/user-create.vue'

// Fetch users from backend with reactive query
const { data, isPending } = useGetUsersQuery()

// Convert UserInterface to User type for the table
const tableData = computed<UserInterface[]>(() => {
  const list = data?.value?.data || []
  return list
})

// Keep the loading state
const loading = computed(() => isPending.value)
</script>

<template>
  <Page
    title="Users"
    description="Users description"
    sticky
  >
    <template #actions>
      <UserCreate />
    </template>
    <div class="overflow-x-auto">
      <DataTable
        :loading="loading"
        :data="tableData"
        :columns="columns"
      />
    </div>
  </Page>
</template>
