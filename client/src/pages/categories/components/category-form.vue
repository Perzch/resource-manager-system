<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'

import type { CategoryInterface } from '@/types/type'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from '@/services/api/categories.api'

const { category } = defineProps<{ category?: CategoryInterface }>()

const emits = defineEmits<{ (e: 'close'): void }>()

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required').default(category?.name || ''),
  recommend: z.string().optional().default(category?.recommend || ''),
})

const schema = toTypedSchema(formSchema)
const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {},
})

const createCategoryMutation = useCreateCategoryMutation()
const updateCategoryMutation = useUpdateCategoryMutation()
const getCategoriesQuery = useGetCategoriesQuery()

const onSubmit = handleSubmit(async (values) => {
  const payload: CategoryInterface = { ...values }
  if (category?.id) {
    payload.id = category.id
  }

  toast('You submitted the following values:', {
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(payload, null, 2))),
  })

  if (payload.id) {
    await updateCategoryMutation.mutateAsync(payload as Required<Pick<CategoryInterface, 'id'>> & Partial<CategoryInterface>)
  }
  else {
    await createCategoryMutation.mutateAsync(payload)
  }
  await getCategoriesQuery.refetch()
  emits('close')
})
</script>

<template>
  <form class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="recommend">
      <FormItem>
        <FormLabel>Recommend</FormLabel>
        <FormControl>
          <Textarea rows="4" placeholder="Recommendation or notes" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" class="w-full">
      Save Changes
    </Button>
  </form>
</template>
