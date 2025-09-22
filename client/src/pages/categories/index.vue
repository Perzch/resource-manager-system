<script setup lang="ts">
import type { CategoryInterface } from '@/types/type'

import Page from '@/components/global-layout/basic-page.vue'
import { useGetCategoriesQuery } from '@/services/api/categories.api'

import { columns } from './components/columns'
import CategoryCreate from './components/category-create.vue'
import DataTable from './components/data-table.vue'

const { data, isPending } = useGetCategoriesQuery()

const tableData = computed<CategoryInterface[]>(() => {
  const list = data?.value?.data || []
  return list
})

const loading = computed(() => isPending.value)
</script>

<template>
  <Page
    title="Categories"
    description="Manage resource categories"
    sticky
  >
    <template #actions>
      <CategoryCreate />
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
