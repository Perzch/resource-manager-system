<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import { ChevronsUpDown, Check } from 'lucide-vue-next'

import type { ResourceInterface, CategoryInterface } from '@/types/type'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { uploadFileToPresignedUrl, useGetUploadSignatureMutation } from '@/services/api/upload.api'
import { useCreateResourceMutation, useGetResourcesQuery } from '@/services/api/resources.api'
import { useGetCategoriesQuery } from '@/services/api/categories.api'

const { resource } = defineProps<{
  resource?: ResourceInterface
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

// File upload state for resource file
const fileInputRef = useTemplateRef<HTMLInputElement>('fileInputRef')
const fileUploading = ref(false)
const fileUploadProgress = ref(0)
const fileName = ref<string>('')
const fileUrl = ref<string>(resource?.link || '')

// Upload API mutations
const uploadSignatureMutation = useGetUploadSignatureMutation()
const createResourceMutation = useCreateResourceMutation()
const getResourcesQuery = useGetResourcesQuery()

// Categories query and state
const categoriesQuery = useGetCategoriesQuery()
const categories = computed(() => categoriesQuery.data.value?.data || [])
const categorySearchQuery = ref('')
const categoryOpen = ref(false)

// Filter categories based on search query
const filteredCategories = computed(() => {
  if (!categorySearchQuery.value) {
    return categories.value
  }
  return categories.value.filter(category =>
    category.name?.toLowerCase().includes(categorySearchQuery.value.toLowerCase())
  )
})

// Initialize preview if resource already has files
onMounted(() => {
  if (resource?.link) {
    fileUrl.value = resource.link
  }
  // Set category values if resource already has a category
  if (resource?.category) {
    selectedCategory.value = resource.category
    setFieldValue('category.id', resource.category.id)
    setFieldValue('category.name', resource.category.name)
  }
})

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Resource name is required'),
  description: z.string().optional(),
  link: z.string().optional(),
  category: z.object({
    id: z.number().optional(),
    name: z.string().min(1, 'Category is required'),
  }),
})

const resourceFormSchema = toTypedSchema(formSchema)
const { handleSubmit, setFieldValue } = useForm({
  validationSchema: resourceFormSchema,
  initialValues: {
    id: resource?.id,
    name: resource?.name || '',
    description: resource?.description || '',
    link: resource?.link || '',
    category: {
      id: resource?.category?.id,
      name: resource?.category?.name || ''
    }
  },
})

// Track selected category
const selectedCategory = ref<CategoryInterface | null>(
  resource?.category || null
)

// Handle category selection
function selectCategory(category: CategoryInterface) {
  selectedCategory.value = category
  setFieldValue('category.id', category.id)
  setFieldValue('category.name', category.name)
  categoryOpen.value = false
  categorySearchQuery.value = ''
}

function removeFile() {
  fileName.value = ''
  fileUrl.value = ''
  setFieldValue('link', '')
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) {
    return
  }

  // Validate file size (e.g., max 100MB for resource files)
  if (file.size > 100 * 1024 * 1024) {
    toast.error('Resource file size must be less than 100MB')
    return
  }

  fileName.value = file.name

  try {
    fileUploading.value = true
    fileUploadProgress.value = 0

    // Upload file and get resource URL
    const uploadedUrl = await uploadFile(file)
    fileUrl.value = uploadedUrl
    setFieldValue('link', uploadedUrl)

    toast.success('Resource file uploaded successfully')
  }
  catch (error) {
    console.error('Resource file upload failed:', error)
    toast.error('Failed to upload resource file')
    removeFile()
  }
  finally {
    fileUploading.value = false
    fileUploadProgress.value = 0
  }
}

async function uploadFile(file: File): Promise<string> {
  // Extract file extension from file type or name
  const fileExtension = file.type.split('/')[1] || file.name.split('.').pop() || 'bin'

  // Step 1: Get upload signature
  fileUploadProgress.value = 20
  
  const signature = await uploadSignatureMutation.mutateAsync(fileExtension)

  // Step 2: Upload file to presigned URL
  fileUploadProgress.value = 60
  
  await uploadFileToPresignedUrl(signature.presignedUrl, file)

  // Step 3: Return the file key as the URL
  fileUploadProgress.value = 100
  
  return signature.fileKey
}

const onSubmit = handleSubmit(async (values) => {
  const submitResource = { ...values }
  if (resource) {
    submitResource.id = resource.id
  }

  // Ensure uploaded files are included in the submission
  if (fileUrl.value) {
    submitResource.link = fileUrl.value
  }

  toast('You submitted the following values:', {
    description: h(
      'pre',
      { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
      h('code', { class: 'text-white' }, JSON.stringify(submitResource, null, 2)),
    ),
  })

  await createResourceMutation.mutateAsync(submitResource)
  await getResourcesQuery.refetch()

  emits('close')
})
</script>

<template>
  <form class="space-y-8" @submit="onSubmit">
    <!-- Resource Name -->
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Resource Name</FormLabel>
        <FormControl>
          <Input placeholder="Enter resource name" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Description -->
    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Description (Optional)</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Enter resource description"
            rows="3"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Category -->
    <FormField name="category.name">
      <FormItem>
        <FormLabel>Category</FormLabel>
        <FormControl>
          <Popover v-model:open="categoryOpen">
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                role="combobox"
                :aria-expanded="categoryOpen"
                class="w-full justify-between"
              >
                {{ selectedCategory?.name || 'Select category...' }}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-full p-0">
              <Command>
                <CommandInput 
                  v-model="categorySearchQuery"
                  placeholder="Search categories..." 
                />
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      v-for="category in filteredCategories"
                      :key="category.id"
                      :value="category.name || ''"
                      @select="selectCategory(category)"
                    >
                      <Check
                        :class="cn(
                          'mr-2 h-4 w-4',
                          selectedCategory?.id === category.id ? 'opacity-100' : 'opacity-0'
                        )"
                      />
                      {{ category.name }}
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Resource File Upload Section -->
    <FormField name="link">
      <FormItem>
        <FormLabel>Resource File</FormLabel>
        <FormControl>
          <div class="flex flex-col gap-4">
            <!-- File info -->
            <div v-if="fileName || fileUrl" class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground">📁</span>
                <span class="text-sm">{{ fileName || 'Uploaded file' }}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                :disabled="fileUploading"
                @click="removeFile"
              >
                Remove
              </Button>
            </div>

            <!-- File input -->
            <div class="flex items-center gap-2">
              <Input
                ref="fileInputRef"
                type="file"
                :disabled="fileUploading"
                @change="handleFileSelect"
              />
              <span v-if="fileUploading" class="text-sm text-muted-foreground">
                {{ fileUploadProgress }}%
              </span>
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Submit Button -->
    <div class="flex justify-end gap-2">
      <Button type="button" variant="outline" @click="emits('close')">
        Cancel
      </Button>
      <Button 
        type="submit" 
        :disabled="fileUploading || createResourceMutation.isPending.value"
      >
        {{ createResourceMutation.isPending.value ? 'Creating...' : 'Create Resource' }}
      </Button>
    </div>
  </form>
</template>