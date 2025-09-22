<script lang="ts" setup>
import { Plus } from 'lucide-vue-next'

import CategoryResource from './category-resource.vue'

const isOpen = ref(false)
</script>

<template>
  <UiDialog v-model:open="isOpen">
    <UiDialogTrigger as-child>
      <UiButton>
        <Plus />
        Create Category
      </UiButton>
    </UiDialogTrigger>

    <UiDialogContent class="max-h-[500px] overflow-y-auto">
      <CategoryResource @close="isOpen = false" />
    </UiDialogContent>
  </UiDialog>
</template>
