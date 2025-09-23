<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useRegisterMutation } from '@/services/api/auth.api'

import AuthTitle from './components/auth-title.vue'
import GitHubButton from './components/github-button.vue'
import GoogleButton from './components/google-button.vue'
import PrivacyPolicyButton from './components/privacy-policy-button.vue'
import TermsOfServiceButton from './components/terms-of-service-button.vue'

const router = useRouter()

// 注册表单验证schema
const signUpSchema = z.object({
  username: z
    .string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名不能超过20个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  password: z
    .string()
    .min(6, '密码至少6个字符')
    .max(20, '密码不能超过20个字符'),
  confirmPassword: z
    .string()
    .min(6, '确认密码至少6个字符'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
})

const formSchema = toTypedSchema(signUpSchema)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    username: '',
    password: '',
    confirmPassword: '',
  },
})

// 注册API
const registerMutation = useRegisterMutation()

const onSubmit = handleSubmit(async (values) => {
  try {
    const { confirmPassword, ...registerData } = values
    
    await registerMutation.mutateAsync(registerData)
    
    toast.success('注册成功！请登录', {
      description: '您的账户已创建成功，现在可以使用新账户登录。',
    })
    
    // 注册成功后跳转到登录页
    router.push('/auth/sign-in')
  }
  catch (error: any) {
    console.error('注册失败:', error)
    
    // 根据错误类型显示不同的错误信息
    const errorMessage = error?.response?.data?.message || error?.message || '注册失败，请重试'
    toast.error('注册失败', {
      description: errorMessage,
    })
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen p-4 min-w-screen">
    <main class="flex flex-col gap-4">
      <AuthTitle />
      <UiCard class="max-w-sm mx-auto">
        <UiCardHeader>
          <UiCardTitle class="text-xl">
            Sign Up
          </UiCardTitle>
          <UiCardDescription>
            Enter your username and password to create an account.
            Already have an account?
            <UiButton
              variant="link" class="px-0 text-muted-foreground"
              @click="$router.push('/auth/sign-in')"
            >
              Sign In
            </UiButton>
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent>
          <form class="grid gap-4" @submit="onSubmit">
            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel for="username">
                  Username
                </FormLabel>
                <FormControl>
                  <UiInput 
                    id="username"
                    placeholder="Enter your username"
                    v-bind="componentField"
                    :disabled="registerMutation.isPending.value"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel for="password">
                  Password
                </FormLabel>
                <FormControl>
                  <UiInput 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password"
                    v-bind="componentField"
                    :disabled="registerMutation.isPending.value"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="confirmPassword">
              <FormItem>
                <FormLabel for="confirmPassword">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <UiInput 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirm your password"
                    v-bind="componentField"
                    :disabled="registerMutation.isPending.value"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <UiButton 
              type="submit" 
              class="w-full"
              :disabled="registerMutation.isPending.value"
            >
              <span v-if="registerMutation.isPending.value">Creating Account...</span>
              <span v-else>Create Account</span>
            </UiButton>

            <UiSeparator label="Or continue with" />

            <div class="flex flex-col items-center justify-between gap-4">
              <GitHubButton />
              <GoogleButton />
            </div>

            <UiCardDescription>
              By creating an account, you agree to our
              <TermsOfServiceButton />
              and
              <PrivacyPolicyButton />
            </UiCardDescription>
          </form>
        </UiCardContent>
      </UiCard>
    </main>
  </div>
</template>
