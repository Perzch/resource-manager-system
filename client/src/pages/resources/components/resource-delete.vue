<script setup lang="ts">
import { toast } from 'vue-sonner'

import type { ResourceInterface } from '@/types/type'

import { useDeleteResourcesMutation, useGetResourcesQuery } from '@/services/api/resources.api'

const props = defineProps<{
  resource: ResourceInterface
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const deleteResourcesMutation = useDeleteResourcesMutation()
const getResourcesQuery = useGetResourcesQuery()

async function handleDelete() {
  if (!props.resource.id) {
    toast.error('Resource ID is required')
    return
  }

  try {
    await deleteResourcesMutation.mutateAsync([props.resource.id])
    await getResourcesQuery.refetch()
    toast.success('Resource deleted successfully')
    emits('close')
  }
  catch (error) {
    console.error('Failed to delete resource:', error)
    toast.error('Failed to delete resource')
  }
}
</script>

<template>
  <UiDialogHeader>
    <UiDialogTitle>Delete Resource</UiDialogTitle>
    <UiDialogDescription>
      Are you sure you want to delete "{{ resource.name }}"? This action cannot be undone.
    </UiDialogDescription>
  </UiDialogHeader>

  <div class="flex justify-end gap-2 mt-4">
    <UiButton variant="outline" @click="emits('close')">
      Cancel
    </UiButton>
    <UiButton 
      variant="destructive" 
      :disabled="deleteResourcesMutation.isPending.value"
      @click="handleDelete"
    >
      {{ deleteResourcesMutation.isPending.value ? 'Deleting...' : 'Delete' }}
    </UiButton>
  </div>
</template>