<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import { toast } from 'vue-sonner'

import type { CategoryInterface } from '@/types/type'

import { useDeleteCategoriesMutation, useGetCategoriesQuery } from '@/services/api/categories.api'

const props = defineProps<{
  open: boolean
  table: Table<CategoryInterface>
}>()

const emits = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const deleteCategoriesMutation = useDeleteCategoriesMutation()
const getCategoriesQuery = useGetCategoriesQuery()

const selectedRows = computed(() => props.table.getSelectedRowModel().rows)
const selectedCount = computed(() => selectedRows.value.length)

async function handleBatchDelete() {
  const ids = selectedRows.value
    .map(row => row.original.id)
    .filter((id): id is number => id !== undefined)

  if (ids.length === 0) {
    toast.error('No categories selected')
    return
  }

  try {
    await deleteCategoriesMutation.mutateAsync(ids)
    await getCategoriesQuery.refetch()
    props.table.resetRowSelection()
    toast.success(`${ids.length} category(ies) deleted successfully`)
    emits('update:open', false)
  }
  catch (error) {
    console.error('Failed to delete categories:', error)
    toast.error('Failed to delete categories')
  }
}
</script>

<template>
  <UiDialog :open="open" @update:open="emits('update:open', $event)">
    <UiDialogContent>
      <UiDialogHeader>
        <UiDialogTitle>Delete Categories</UiDialogTitle>
        <UiDialogDescription>
          Are you sure you want to delete {{ selectedCount }} selected category(ies)? This action cannot be undone.
        </UiDialogDescription>
      </UiDialogHeader>

      <UiDialogFooter>
        <UiButton variant="outline" @click="emits('update:open', false)">
          Cancel
        </UiButton>
        <UiButton
          variant="destructive"
          :disabled="deleteCategoriesMutation.isPending.value"
          @click="handleBatchDelete"
        >
          {{ deleteCategoriesMutation.isPending.value ? 'Deleting...' : `Delete ${selectedCount} Category(ies)` }}
        </UiButton>
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
</template>