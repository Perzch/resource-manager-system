<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import { toast } from 'vue-sonner'

import type { ResourceInterface } from '@/types/type'

import { useDeleteResourcesMutation, useGetResourcesQuery } from '@/services/api/resources.api'

const props = defineProps<{
  open: boolean
  table: Table<ResourceInterface>
}>()

const emits = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const deleteResourcesMutation = useDeleteResourcesMutation()
const getResourcesQuery = useGetResourcesQuery()

const selectedRows = computed(() => props.table.getSelectedRowModel().rows)
const selectedCount = computed(() => selectedRows.value.length)

async function handleBatchDelete() {
  const ids = selectedRows.value
    .map(row => row.original.id)
    .filter((id): id is number => id !== undefined)

  if (ids.length === 0) {
    toast.error('No resources selected')
    return
  }

  try {
    await deleteResourcesMutation.mutateAsync(ids)
    await getResourcesQuery.refetch()
    props.table.resetRowSelection()
    toast.success(`${ids.length} resource(s) deleted successfully`)
    emits('update:open', false)
  }
  catch (error) {
    console.error('Failed to delete resources:', error)
    toast.error('Failed to delete resources')
  }
}
</script>

<template>
  <UiDialog :open="open" @update:open="emits('update:open', $event)">
    <UiDialogContent>
      <UiDialogHeader>
        <UiDialogTitle>Delete Resources</UiDialogTitle>
        <UiDialogDescription>
          Are you sure you want to delete {{ selectedCount }} resource(s)? This action cannot be undone.
        </UiDialogDescription>
      </UiDialogHeader>

      <div class="flex justify-end gap-2 mt-4">
        <UiButton variant="outline" @click="emits('update:open', false)">
          Cancel
        </UiButton>
        <UiButton 
          variant="destructive" 
          :disabled="deleteResourcesMutation.isPending.value"
          @click="handleBatchDelete"
        >
          {{ deleteResourcesMutation.isPending.value ? 'Deleting...' : `Delete ${selectedCount} resource(s)` }}
        </UiButton>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>