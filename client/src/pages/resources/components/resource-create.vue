<script lang="ts" setup>
import { Upload } from 'lucide-vue-next'

import ResourceResource from './resource-resource.vue'

const isOpen = ref(false)
</script>

<template>
  <UiDialog v-model:open="isOpen">
    <UiDialogTrigger as-child>
      <UiButton>
        <Upload />
        Create Resource
      </UiButton>
    </UiDialogTrigger>

    <UiDialogContent class="max-h-[500px] overflow-y-auto">
      <ResourceResource @close="isOpen = false" />
    </UiDialogContent>
  </UiDialog>
</template>