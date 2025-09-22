<script setup lang="ts">
import { Trash2Icon } from 'lucide-vue-next'

import type { DataTableProps } from '@/components/data-table/types'

import BulkActions from '@/components/data-table/bulk-actions.vue'
import DataTable from '@/components/data-table/data-table.vue'
import { generateVueTable } from '@/components/data-table/use-generate-vue-table'

import type { ResourceInterface } from '@/types/type'

import DataTableToolbar from './data-table-toolbar.vue'
import ResourceDeleteBatch from './resource-delete-batch.vue'

const props = defineProps<DataTableProps<ResourceInterface>>()
const table = generateVueTable<ResourceInterface>(props)

const resourceDeleteBatchOpen = ref(false)
</script>

<template>
  <BulkActions entity-name="resource" :table>
    <UiTooltip>
      <UiTooltipTrigger as-child>
        <UiButton
          variant="destructive"
          size="icon"
          class="size-8"
          aria-label="Delete selected resources"
          title="Delete selected resources"
          @click="resourceDeleteBatchOpen = true"
        >
          <Trash2Icon />
          <span class="sr-only">Delete selected resources</span>
        </UiButton>
      </UiTooltipTrigger>
      <UiTooltipContent>
        <p>Delete selected resources</p>
      </UiTooltipContent>
    </UiTooltip>

    <ResourceDeleteBatch
      v-model:open="resourceDeleteBatchOpen"
      :table
    />
  </BulkActions>

  <DataTable :columns :table :data :loading>
    <template #toolbar>
      <DataTableToolbar :table="table" class="w-full overflow-x-auto" />
    </template>
  </DataTable>
</template>