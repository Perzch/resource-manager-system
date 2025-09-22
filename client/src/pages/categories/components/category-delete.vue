<script lang="ts" setup>
import { toast } from 'vue-sonner'

import type { CategoryInterface } from '@/types/type'

import { useDeleteCategoriesMutation, useGetCategoriesQuery } from '@/services/api/categories.api'

const { category } = defineProps<{ category: CategoryInterface }>()

const emits = defineEmits<{ (e: 'remove'): void }>()

const deleteCategoriesMutation = useDeleteCategoriesMutation()
const getCategoriesQuery = useGetCategoriesQuery()

async function handleRemove() {
  toast(`The following category has been deleted:`, {
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(category, null, 2))),
  })
  await deleteCategoriesMutation.mutateAsync([category.id!])
  getCategoriesQuery.refetch()
  emits('remove')
}
</script>

<template>
  <div>
    <UiDialogTitle>
      Delete this category: {{ category.name }} ?
    </UiDialogTitle>
    <UiDialogDescription class="mt-2 font-medium">
      You are about to delete a category with the ID {{ category.id }}. This action cannot be undone.
    </UiDialogDescription>

    <UiDialogFooter>
      <UiDialogClose as-child>
        <UiButton variant="outline">
          Cancel
        </UiButton>
      </UiDialogClose>

      <UiDialogClose as-child>
        <UiButton variant="destructive" @click="handleRemove">
          Delete
        </UiButton>
      </UiDialogClose>
    </UiDialogFooter>
  </div>
</template>
