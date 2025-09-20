<script lang="ts" setup>
import { useLoginMutation } from '@/services/api/auth.api'

const auth = useAuth()
const loginMutation = useLoginMutation()

const params = ref({
  username: '',
  password: '',
})

async function login() {
  if (!params.value.username || !params.value.password) {
    return
  }
  const data = await loginMutation.mutateAsync(params.value)
  auth.login(data)
}
</script>

<template>
  <UiCard class="w-full max-w-md">
    <UiCardHeader>
      <UiCardTitle class="text-2xl">
        Login
      </UiCardTitle>
      <UiCardDescription>
        Enter your email and password below to log into your account.
        Not have an account?
        <UiButton
          variant="link" class="px-0 text-muted-foreground"
          @click="$router.push('/auth/sign-up')"
        >
          Sign Up
        </UiButton>
      </UiCardDescription>
    </UiCardHeader>
    <UiCardContent class="grid gap-4">
      <div class="grid gap-2">
        <UiLabel for="email">
          Email
        </UiLabel>
        <UiInput id="email" v-model="params.username" type="email" placeholder="m@example.com" />
      </div>
      <div class="grid gap-2">
        <div class="flex items-center justify-between">
          <UiLabel for="password">
            Password
          </UiLabel>
        </div>
        <UiInput id="password" v-model="params.password" type="password" placeholder="*********" />
      </div>

      <UiButton
        class="w-full"
        :disabled="loginMutation.isPending.value || !params.username || !params.password"
        @click="login"
      >
        {{ loginMutation.isPending.value ? 'Logging in...' : 'Login' }}
      </UiButton>

      <!-- <UiSeparator label="Or continue with" /> -->

      <!-- <div class="flex flex-col items-center justify-between gap-4">
        <GitHubButton />
        <GoogleButton />
      </div> -->

      <!-- <UiCardDescription>
        By clicking login, you agree to our
        <TermsOfServiceButton />
        and
        <PrivacyPolicyButton />
      </UiCardDescription> -->
    </UiCardContent>
  </UiCard>
</template>

<style scoped>

</style>
