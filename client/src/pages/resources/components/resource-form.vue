<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'

import type { ResourceInterface } from '@/types/type'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { uploadFileToPresignedUrl, useGetUploadSignatureMutation } from '@/services/api/upload.api'
import { useCreateResourceMutation, useGetResourcesQuery } from '@/services/api/resources.api'
import env from '@/utils/env'

const { resource } = defineProps<{
  resource?: ResourceInterface
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

// File upload state for icon
const iconInputRef = useTemplateRef<HTMLInputElement>('iconInputRef')
const iconUploading = ref(false)
const iconUploadProgress = ref(0)
const iconPreview = ref<string>('')
const iconUrl = ref<string>(resource?.icon || '')

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

// Initialize preview if resource already has files
onMounted(() => {
  if (resource?.icon) {
    iconUrl.value = resource.icon
  }
  if (resource?.link) {
    fileUrl.value = resource.link
  }
})

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Resource name is required').default(resource?.name || ''),
  description: z.string().optional().default(resource?.description || ''),
  icon: z.string().optional().default(resource?.icon || ''),
  link: z.string().optional().default(resource?.link || ''),
  category: z.object({
    id: z.number().optional(),
    name: z.string().min(1, 'Category is required'),
  }).default({ name: '' }),
})

const resourceFormSchema = toTypedSchema(formSchema)
const { handleSubmit, setFieldValue } = useForm({
  validationSchema: resourceFormSchema,
  initialValues: {},
})

function removeIcon() {
  iconPreview.value = ''
  iconUrl.value = ''
  setFieldValue('icon', '')
  if (iconInputRef.value) {
    iconInputRef.value.value = ''
  }
}

function removeFile() {
  fileName.value = ''
  fileUrl.value = ''
  setFieldValue('link', '')
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

async function handleIconSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) {
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file for icon')
    return
  }

  // Validate file size (e.g., max 2MB for icons)
  if (file.size > 2 * 1024 * 1024) {
    toast.error('Icon file size must be less than 2MB')
    return
  }

  // Show preview
  const reader = new FileReader()
  reader.onload = (e) => {
    iconPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  try {
    iconUploading.value = true
    iconUploadProgress.value = 0

    // Upload file and get icon URL
    const uploadedUrl = await uploadFile(file, 'icon')
    iconUrl.value = uploadedUrl
    setFieldValue('icon', uploadedUrl)

    toast.success('Icon uploaded successfully')
  }
  catch (error) {
    console.error('Icon upload failed:', error)
    toast.error('Failed to upload icon')
    removeIcon()
  }
  finally {
    iconUploading.value = false
    iconUploadProgress.value = 0
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
    const uploadedUrl = await uploadFile(file, 'resource')
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

async function uploadFile(file: File, type: 'icon' | 'resource'): Promise<string> {
  // Extract file extension from file type or name
  const fileExtension = file.type.split('/')[1] || file.name.split('.').pop() || 'bin'

  // Step 1: Get upload signature
  if (type === 'icon') {
    iconUploadProgress.value = 20
  } else {
    fileUploadProgress.value = 20
  }
  
  const signature = await uploadSignatureMutation.mutateAsync(fileExtension)

  // Step 2: Upload file to presigned URL
  if (type === 'icon') {
    iconUploadProgress.value = 60
  } else {
    fileUploadProgress.value = 60
  }
  
  await uploadFileToPresignedUrl(signature.presignedUrl, file)

  // Step 3: Return the file key as the URL
  if (type === 'icon') {
    iconUploadProgress.value = 100
  } else {
    fileUploadProgress.value = 100
  }
  
  return signature.fileKey
}

const onSubmit = handleSubmit(async (values) => {
  const submitResource = { ...values }
  if (resource) {
    submitResource.id = resource.id
  }

  // Ensure uploaded files are included in the submission
  if (iconUrl.value) {
    submitResource.icon = iconUrl.value
  }
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
    <!-- Icon Upload Section -->
    <FormField name="icon">
      <FormItem>
        <FormLabel>Icon (Optional)</FormLabel>
        <FormControl>
          <div class="flex flex-col gap-4">
            <!-- Icon preview -->
            <div v-if="iconPreview || iconUrl" class="flex items-center gap-4">
              <img
                :src="`${env.VITE_IMAGE_PREFIX}${iconPreview || iconUrl}`"
                alt="Icon preview"
                class="w-16 h-16 rounded object-cover border"
              >
              <Button
                type="button"
                variant="outline"
                size="sm"
                :disabled="iconUploading"
                @click="removeIcon"
              >
                Remove
              </Button>
            </div>

            <!-- Icon file input -->
            <div class="flex items-center gap-2">
              <Input
                ref="iconInputRef"
                type="file"
                accept="image/*"
                :disabled="iconUploading"
                @change="handleIconSelect"
              />
              <span v-if="iconUploading" class="text-sm text-muted-foreground">
                {{ iconUploadProgress }}%
              </span>
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Resource Name -->
    <FormField name="name">
      <FormItem>
        <FormLabel>Resource Name</FormLabel>
        <FormControl>
          <Input placeholder="Enter resource name" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Description -->
    <FormField name="description">
      <FormItem>
        <FormLabel>Description (Optional)</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Enter resource description"
            rows="3"
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
          <Input placeholder="Enter category name" />
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
        :disabled="iconUploading || fileUploading || createResourceMutation.isPending.value"
      >
        {{ createResourceMutation.isPending.value ? 'Creating...' : 'Create Resource' }}
      </Button>
    </div>
  </form>
</template>