<script setup lang="ts">
import { Trash2Icon } from 'lucide-vue-next'

import type { DataTableProps } from '@/components/data-table/types'
import type { CategoryInterface } from '@/types/type'

import BulkActions from '@/components/data-table/bulk-actions.vue'
import DataTable from '@/components/data-table/data-table.vue'
import { generateVueTable } from '@/components/data-table/use-generate-vue-table'

import DataTableToolbar from './data-table-toolbar.vue'
import CategoryDeleteBatch from './category-delete-batch.vue'

const props = defineProps<DataTableProps<CategoryInterface>>()
const table = generateVueTable<CategoryInterface>(props)

const categoryDeleteBatchOpen = ref(false)
</script>

<template>
  <BulkActions entity-name="category" :table>
    <UiTooltip>
      <UiTooltipTrigger as-child>
        <UiButton
          variant="destructive"
          size="icon"
          class="size-8"
          aria-label="Delete selected categories"
          title="Delete selected categories"
          @click="categoryDeleteBatchOpen = true"
        >
          <Trash2Icon />
          <span class="sr-only">Delete selected categories</span>
        </UiButton>
      </UiTooltipTrigger>
      <UiTooltipContent>
        <p>Delete selected categories</p>
      </UiTooltipContent>
    </UiTooltip>

    <CategoryDeleteBatch
      v-model:open="categoryDeleteBatchOpen"
      :table
    />
  </BulkActions>

  <DataTable :columns :data :loading :table>
    <template #toolbar>
      <DataTableToolbar :table class="w-full overflow-x-auto" />
    </template>
  </DataTable>
</template>
