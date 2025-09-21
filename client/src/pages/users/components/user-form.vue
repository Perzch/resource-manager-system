<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'

import type { UserInterface } from '@/types/type'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PermissionEnum } from '@/enums/global'
import { uploadFileToPresignedUrl, useGetUploadSignatureMutation } from '@/services/api/upload.api'
import { useCreateUserMutation, useGetUsersQuery } from '@/services/api/users.api'
import env from '@/utils/env'

const { user } = defineProps<{
  user?: UserInterface
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const roles = [{ value: PermissionEnum.ADMIN, label: 'Admin' }, { value: PermissionEnum.MANAGE, label: 'Manager' }, { value: PermissionEnum.UPDATE, label: 'Editor' }, { value: PermissionEnum.READ, label: 'Reader' }, { value: PermissionEnum.BASE, label: 'Base' }, { value: PermissionEnum.WRITE, label: 'Writer' }] as const
const status = [{ value: true, label: 'Active' }, { value: false, label: 'Inactive' }] as const

// File upload state
const fileInputRef = useTemplateRef<HTMLInputElement>('fileInputRef')
const uploading = ref(false)
const uploadProgress = ref(0)
const avatarPreview = ref<string>('')
const avatarUrl = ref<string>(user?.avatar || '')

// Upload API mutations
const uploadSignatureMutation = useGetUploadSignatureMutation()
const createUserMutation = useCreateUserMutation()
const getUserQuery = useGetUsersQuery()

// Initialize avatar preview if user already has an avatar
onMounted(() => {
  if (user?.avatar) {
    avatarUrl.value = user.avatar
  }
})

const formSchema = z.object({
  id: z.number().optional(),
  username: z.string().min(1).default(user?.username || ''),
  password: z.string().min(6).default(''),
  status: z.boolean().default(user?.status || true),
  role: z.number().default(user?.role || PermissionEnum.READ),
  avatar: z.string().optional().default(user?.avatar || ''),
})

const userInviteFormSchema = toTypedSchema(formSchema)
const { handleSubmit, setFieldValue } = useForm({
  validationSchema: userInviteFormSchema,
  initialValues: {},
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
  const submitUser = { ...values }
  if (user) {
    submitUser.id = user.id
  }

  // Ensure avatar is included in the submission
  if (avatarUrl.value) {
    submitUser.avatar = avatarUrl.value
  }
  toast('You submitted the following values:', {
    description: h(
      'pre',
      { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
      h('code', { class: 'text-white' }, JSON.stringify(submitUser, null, 2)),
    ),
  })

  await createUserMutation.mutateAsync(submitUser)
  await getUserQuery.refetch()

  emits('close')
})
</script>

<template>
  <form class="space-y-8" @submit="onSubmit">
    <FormField name="avatar">
      <FormItem>
        <FormLabel>Avatar</FormLabel>
        <FormControl>
          <div class="flex flex-col gap-4">
            <!-- Avatar preview -->
            <div v-if="avatarPreview || avatarUrl" class="flex items-center gap-4">
              <img
                :src="`${env.VITE_IMAGE_PREFIX}${avatarPreview || avatarUrl}`"
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
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>User Name</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="status">
      <FormItem>
        <FormLabel>Status</FormLabel>
        <FormControl>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="state in status" :key="state.label" :value="state.value">
                  {{ state.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="role">
      <FormItem>
        <FormLabel>Role</FormLabel>
        <FormControl>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="role in roles" :key="role.value" :value="role.value">
                  {{ role.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" class="w-full">
      SaveChanges
    </Button>
  </form>
</template>

<style scoped>

</style>
