<script setup lang="ts">
import type { CategoryInterface } from '@/types/type'

import Page from '@/components/global-layout/basic-page.vue'
import { useGetCategoriesQuery } from '@/services/api/categories.api'
import { PermissionEnum } from '@/enums/global'

import { columns } from './components/columns'
import CategoryCreate from './components/category-create.vue'
import DataTable from './components/data-table.vue'

definePage({
  meta: {
    auth: true,
    role: PermissionEnum.WRITE
  }
})

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
      <!-- 只有管理者才能创建分类 -->
      <CategoryCreate v-permission="PermissionEnum.WRITE" />
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
