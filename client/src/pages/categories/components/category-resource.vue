<script lang="ts" setup>
import type { CategoryInterface } from '@/types/type'

import CategoryForm from './category-form.vue'

const props = defineProps<{ category?: CategoryInterface }>()

defineEmits(['close'])

const category = computed(() => props.category)
const title = computed(() => category.value?.id ? 'Edit Category' : 'New Category')
const description = computed(() => category.value?.id ? `Edit category ${category.value.name}` : 'Create new category')
</script>

<template>
  <UiDialogHeader>
    <UiDialogTitle>
      {{ title }}
    </UiDialogTitle>
    <UiDialogDescription>
      {{ description }}
    </UiDialogDescription>
  </UiDialogHeader>

  <CategoryForm class="mt-2" :category="category" @close="$emit('close')" />
</template>
