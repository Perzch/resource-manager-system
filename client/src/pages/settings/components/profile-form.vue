<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { uploadFileToPresignedUrl, useGetUploadSignatureMutation } from '@/services/api/upload.api'
import { useUpdateUserMutation } from '@/services/api/users.api'
import { useAuthStore } from '@/stores/auth'
import env from '@/utils/env'

// Get current user from auth store
const authStore = useAuthStore()
const currentUser = computed(() => authStore.userInfo)

// File upload state
const fileInputRef = useTemplateRef<HTMLInputElement>('fileInputRef')
const uploading = ref(false)
const uploadProgress = ref(0)
const avatarPreview = ref<string>('')
const avatarUrl = ref<string>(currentUser.value?.avatar || '')

// Upload API mutations
const uploadSignatureMutation = useGetUploadSignatureMutation()
const updateUserMutation = useUpdateUserMutation()

// Initialize avatar preview if user already has an avatar
onMounted(() => {
  if (currentUser.value?.avatar) {
    avatarUrl.value = currentUser.value.avatar
  }
})

// Updated form schema for profile editing
const profileFormSchema = z.object({
  id: z.number().optional(),
  username: z.string().min(2, 'Username must be at least 2 characters').max(30, 'Username must not be longer than 30 characters'),
  avatar: z.string().optional(),
})

const formSchema = toTypedSchema(profileFormSchema)

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    id: currentUser.value?.id,
    username: currentUser.value?.username || '',
    avatar: currentUser.value?.avatar || '',
  },
})

function removeAvatar() {
  avatarPreview.value = ''
  avatarUrl.value = ''
  setFieldValue('avatar', '')
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

  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file')
    return
  }

  // Validate file size (e.g., max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('File size must be less than 5MB')
    return
  }

  // Show preview
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  try {
    uploading.value = true
    uploadProgress.value = 0

    // Upload file and get avatar URL
    const uploadedUrl = await uploadAvatar(file)
    avatarUrl.value = uploadedUrl
    setFieldValue('avatar', uploadedUrl)

    toast.success('Avatar uploaded successfully')
  }
  catch (error) {
    console.error('Upload failed:', error)
    toast.error('Failed to upload avatar')
    removeAvatar()
  }
  finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

async function uploadAvatar(file: File): Promise<string> {
  // Extract file extension from file type
  const fileExtension = file.type.split('/')[1] || 'jpg'

  // Step 1: Get upload signature
  uploadProgress.value = 20
  const signature = await uploadSignatureMutation.mutateAsync(fileExtension)

  // Step 2: Upload file to presigned URL
  uploadProgress.value = 60
  await uploadFileToPresignedUrl(signature.presignedUrl, file)

  // Step 3: Return the file key as the avatar URL
  uploadProgress.value = 100
  return signature.fileKey
}

const onSubmit = handleSubmit(async (values) => {
  try {
    if (!currentUser.value?.id) {
      toast.error('User not found')
      return
    }

    const submitData = {
      id: currentUser.value.id,
      username: values.username,
      avatar: avatarUrl.value || values.avatar,
    }

    await updateUserMutation.mutateAsync(submitData)
    
    // Update auth store with new user info
    authStore.userInfo = {
      ...authStore.userInfo,
      username: submitData.username,
      avatar: submitData.avatar,
    }

    toast.success('Profile updated successfully!')
  }
  catch (error) {
    console.error('Update failed:', error)
    toast.error('Failed to update profile')
  }
})
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      Profile
    </h3>
    <p class="text-sm text-muted-foreground">
      Update your profile information and avatar.
    </p>
  </div>
  <Separator orientation="horizontal" class="my-4" />
  
  <form class="space-y-8" @submit="onSubmit">
    <!-- Avatar Upload Section -->
    <FormField name="avatar">
      <FormItem>
        <FormLabel>Avatar</FormLabel>
        <FormControl>
          <div class="flex flex-col gap-4">
            <!-- Avatar preview -->
            <div v-if="avatarPreview || avatarUrl" class="flex items-center gap-4">
              <img
                :src="avatarPreview || `${env.VITE_IMAGE_PREFIX}${avatarUrl}`"
                alt="Avatar preview"
                class="w-16 h-16 rounded-full object-cover border"
              >
              <Button
                type="button"
                variant="outline"
                size="sm"
                :disabled="uploading"
                @click="removeAvatar"
              >
                Remove
              </Button>
            </div>

            <!-- File input -->
            <div class="flex items-center gap-2">
              <Input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                :disabled="uploading"
                @change="handleFileSelect"
              />
              <span v-if="uploading" class="text-sm text-muted-foreground">
                {{ uploadProgress }}%
              </span>
            </div>
          </div>
        </FormControl>
        <FormDescription>
          Upload a profile picture. Supported formats: JPG, PNG, GIF. Max size: 5MB.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Username Field -->
    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Enter your username" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          This is your public display name. It can be your real name or a pseudonym.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Submit Button -->
    <div class="flex justify-start gap-2">
      <Button 
        type="submit" 
        :disabled="updateUserMutation.isPending.value"
      >
        <span v-if="updateUserMutation.isPending.value">Updating...</span>
        <span v-else>Update Profile</span>
      </Button>
    </div>
  </form>
</template>
