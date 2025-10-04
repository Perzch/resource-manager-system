<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import { ChevronsUpDown, Check } from 'lucide-vue-next'

import type { ResourceInterface, CategoryInterface } from '@/types/type'
import { useAuthStore } from '@/stores/auth'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { uploadFileToPresignedUrl, useGetUploadSignatureMutation } from '@/services/api/upload.api'
import { useCreateResourceMutation, useUpdateResourceMutation, useGetResourcesQuery } from '@/services/api/resources.api'
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
const updateResourceMutation = useUpdateResourceMutation()
const getResourcesQuery = useGetResourcesQuery()

// Auth and permissions
const authStore = useAuthStore()

// Check if current user can edit this resource
const canEdit = computed(() => {
  if (!resource) return true // Creating new resource
  const userRole = authStore.userInfo.role || 0
  const hasManagePermission = (userRole & 7) === 7
  const hasAdminPermission = (userRole & 15) === 15
  const isManager = hasManagePermission || hasAdminPermission
  return resource.user?.id === authStore.userInfo.id || isManager
})

// Check if current user can modify status
const canModifyStatus = computed(() => {
  if (!resource) return false // Can't modify status when creating
  const userRole = authStore.userInfo.role || 0
  const hasManagePermission = (userRole & 7) === 7
  const hasAdminPermission = (userRole & 15) === 15
  return canEdit.value && (hasManagePermission || hasAdminPermission)
})

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
  status: z.number().optional(),
  user: z.object({
    id: z.number().optional()
  }).optional(),
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
    status: resource?.status || 3, // Default to PENDING for new resources
    user: {
      id: resource?.user?.id
    },
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
  const fileExtension = file.name.split('.').pop() || ''

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
  
  // Ensure uploaded files are included in the submission
  if (fileUrl.value) {
    submitResource.link = fileUrl.value
  }

  if(!submitResource.user.id) {
    submitResource.user = undefined
  }

  try {
    if (resource?.id) {
      // Update existing resource - ensure ID is present
      submitResource.id = resource.id
      await updateResourceMutation.mutateAsync(submitResource as any)
      toast.success('Resource updated successfully')
    } else {
      // Create new resource
      await createResourceMutation.mutateAsync(submitResource)
      toast.success('Resource created successfully')
    }
    
    await getResourcesQuery.refetch()
    emits('close')
  } catch (error) {
    console.error('Failed to save resource:', error)
    toast.error(resource?.id ? 'Failed to update resource' : 'Failed to create resource')
  }
})
</script>

<template>
  <form class="space-y-8" @submit="onSubmit">
    <!-- Warning message if user cannot edit -->
    <div v-if="resource && !canEdit" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
      <p class="text-sm text-yellow-800">
        ⚠️ You can only edit resources that you own or have management privileges.
      </p>
    </div>

    <!-- Resource Name -->
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Resource Name</FormLabel>
        <FormControl>
          <Input 
            placeholder="Enter resource name" 
            v-bind="componentField" 
            :disabled="resource && !canEdit"
          />
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
            :disabled="resource && !canEdit"
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
                :disabled="resource && !canEdit"
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

    <!-- Status (only for editing and only for managers) -->
    <FormField v-if="resource && canModifyStatus" name="status" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Status</FormLabel>
        <FormControl>
          <Select 
            :model-value="String(componentField.modelValue || 3)"
            @update:model-value="(value) => componentField['onUpdate:modelValue']?.(Number(value))"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Active</SelectItem>
              <SelectItem value="2">Inactive</SelectItem>
              <SelectItem value="3" disabled>Pending</SelectItem>
            </SelectContent>
          </Select>
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
                :disabled="fileUploading || (resource && !canEdit)"
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
        :disabled="fileUploading || createResourceMutation.isPending.value || updateResourceMutation.isPending.value || !canEdit"
      >
        {{ 
          updateResourceMutation.isPending.value 
            ? 'Updating...' 
            : createResourceMutation.isPending.value 
              ? 'Creating...' 
              : resource?.id 
                ? 'Update Resource' 
                : 'Create Resource' 
        }}
      </Button>
    </div>
  </form>
</template>