<script setup lang="ts">
import type { ResourceInterface } from '@/types/type'

import Page from '@/components/global-layout/basic-page.vue'
import { useGetResourcesQuery } from '@/services/api/resources.api'
import { PermissionEnum } from '@/enums/global'

import { columns } from './components/columns'
import DataTable from './components/data-table.vue'
import ResourceCreate from './components/resource-create.vue'

definePage({
  meta: {
    auth: true,
    role: PermissionEnum.READ
  }
})

// Fetch resources from backend with reactive query
const { data, isPending } = useGetResourcesQuery()

// Convert ResourceInterface to Resource type for the table
const tableData = computed<ResourceInterface[]>(() => {
  const list = data?.value?.data || []
  return list
})

// Keep the loading state
const loading = computed(() => isPending.value)
</script>

<template>
  <Page
    title="Resources"
    description="Resource management system"
    sticky
  >
    <template #actions>
      <!-- 只有拥有写入权限的用户才能创建资源 -->
       <div v-permission="PermissionEnum.WRITE">
         <ResourceCreate />
       </div>
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