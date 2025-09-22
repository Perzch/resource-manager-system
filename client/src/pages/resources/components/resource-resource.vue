<script lang="ts" setup>
import type { ResourceInterface } from '@/types/type'

import ResourceForm from './resource-form.vue'

const props = defineProps<{
  resource?: ResourceInterface
}>()
defineEmits(['close'])

const resource = computed(() => props.resource)
const title = computed(() => resource.value?.id ? `Edit Resource` : 'New Resource')
const description = computed(() => resource.value?.id ? `Edit resource ${resource.value.name}` : 'Create new resource')
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

  <ResourceForm class="mt-2" :resource="resource" @close="$emit('close')" />
</template>